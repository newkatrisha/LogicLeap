export type MathQuestion = {
  question: string;
  answer: number;
  choices: number[];
  num1: number;
  operation: string;
  num2: number;
};

export const generateMathQuestions = (type: number, age = 0) => {
  const questions: MathQuestion[] = [];
  let numQuestions = 5; // Default number of questions
  const operations = { sum: "+", minus: "-", multiply: "*", divide: "/" }; // Map operation types to symbols
  let operationKeys = ["sum"]; // Default to addition
  let maxNum1 = 10; // Default max number for the first number
  const maxNum2 = 10; // Default max number for the second number

  if (typeof type === "number") {
    age = type;
    numQuestions = 3; // Set for test
    operationKeys =
      age < 7 ? ["sum", "minus"] : ["sum", "minus", "multiply", "divide"];
    maxNum1 = age >= 7 ? 100 : 10;
  } else {
    operationKeys = [type];
    maxNum1 = age >= 7 ? 100 : 10;
  }

  const generateChoices = (correctAnswer: number) => {
    const choices = new Set();
    choices.add(correctAnswer);

    while (choices.size < 4) {
      const wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
      if (wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
        choices.add(wrongAnswer);
      }
    }

    return Array.from(choices).sort(() => Math.random() - 0.5);
  };

  operationKeys.forEach((key) => {
    for (let i = 0; i < numQuestions; i++) {
      let num1, num2, answer;

      if (key === "divide") {
        num2 = Math.floor(Math.random() * maxNum2) + 1;
        answer = Math.floor(Math.random() * maxNum1) + 1;
        num1 = num2 * answer;
      } else {
        num1 =
          key === "multiply" && age < 7
            ? Math.floor(Math.random() * 9) + 1
            : Math.floor(Math.random() * maxNum1) + 1;
        num2 = Math.floor(Math.random() * maxNum2) + 1;
        switch (key) {
          case "sum":
            answer = num1 + num2;
            break;
          case "minus":
            answer = num1 - num2;
            break;
          case "multiply":
            answer = num1 * num2;
            break;
        }
      }

      const question = `What is ${num1} ${
        operations[key as keyof typeof operations]
      } ${num2}?`;
      const choices = generateChoices(Number(answer));
      questions.push({
        question,
        answer: Number(answer),
        choices: choices as number[],
        num1,
        operation: operations[key as keyof typeof operations],
        num2,
      });
    }
  });

  return questions;
};
