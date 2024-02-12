// server.js

import express from "express";
import OpenAI from "openai";
import rowData, { prompt } from "./rowDate.js";
import fs from "fs";
const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: "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",
});

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `what is QWER?`,
        },
      ],
      max_tokens: 3000,
    });

    console.log(response.choices[0].message.content);
    res.send(response.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/fine-tune", async (req, res) => {
  const untestedData = rowData.map((raw) => {
    const { input, output } = raw;
    const system = {
      role: "system",
      content: prompt,
    };
    const user = {
      role: "user",
      content: input,
    };
    const assistant = {
      role: "assistant",
      content: output,
    };
    const data = { messages: [system, user, assistant] };
    return data;
  });
  const transformIntoJSONL = async (trainingData) => {
    const filepath = "./generated.jsonl";
    const jsonl = trainingData
      .map((data) => JSON.stringify(data))
      .flat()
      .join("\n");
    try {
      await fs.promises.writeFile(filepath, jsonl);
    } catch (e) {}
  };
  transformIntoJSONL(untestedData);
  // If you have access to Node fs we recommend using fs.createReadStream():

  try {
    const file = await openai.files.create({
      file: fs.createReadStream("generated.jsonl"),
      purpose: "fine-tune",
    });
    await openai.fineTuning.jobs.create({
      model: "gpt-3.5-turbo",
      training_file: file?.id,
    });
  } catch (e) {
    console.log("🚀 ~ app.get ~ e:", e);
  }

  res.send(untestedData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
