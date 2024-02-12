export const prompt = "tell information about QWER system";

const exampleOne = {
  input: "QWER is a testing env",
  output: JSON.stringify({ name: "QWER", purpose: "testing env" }),
};

const exampleTwo = {
  input: "is QWER free?",
  output: JSON.stringify({ name: "QWER", purpose: "free env" }),
};

const rowData = [exampleOne, exampleTwo];
export default rowData;
