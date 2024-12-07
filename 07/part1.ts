import * as fs from "node:fs/promises";
import * as path from "node:path";

type SplittedEquation = [
  number,
  ...Array<(typeof POSSIBLE_OPERATORS)[number] | number>
];

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const input = `190: 10 19
// 3267: 81 40 27
// 83: 17 5
// 156: 15 6
// 7290: 6 8 6 15
// 161011: 16 10 13
// 192: 17 8 14
// 21037: 9 7 18 13
// 292: 11 6 16 20`;

const parsedInput: { result: number; equationComponents: number[] }[] = input
  .split("\n")
  .map((line) => {
    const [result, equationComponents] = line.split(":");

    return {
      result: Number.parseInt(result),
      equationComponents: equationComponents
        .trim()
        .split(" ")
        .map((value) => Number.parseInt(value)),
    };
  });

const POSSIBLE_OPERATORS = ["+", "*"] as const;

function getPossibleEquations(equationComponents: number[]) {
  return Math.pow(POSSIBLE_OPERATORS.length, equationComponents.length - 1);
}

function generatePossibleEquations(
  equationComponents: number[]
): SplittedEquation[] {
  const possibleEquations = getPossibleEquations(equationComponents);
  const numberOfOperatorsNeededInEquation = equationComponents.length - 1;

  const equations: ReturnType<typeof generatePossibleEquations> = [];

  for (let i = 0; i < possibleEquations; i++) {
    let finalEquation: ReturnType<typeof generatePossibleEquations>[0] = [
      equationComponents[0],
    ];
    let operatorIndex = i;

    for (let j = 0; j < numberOfOperatorsNeededInEquation; j++) {
      const operator =
        POSSIBLE_OPERATORS[operatorIndex % POSSIBLE_OPERATORS.length];
      finalEquation.push(operator, equationComponents[j + 1]);
      operatorIndex = Math.floor(operatorIndex / POSSIBLE_OPERATORS.length);
    }

    equations.push(finalEquation);
  }

  return equations;
}

function calcIgnorePrecedenceRule(equation: SplittedEquation) {
  let result = equation[0];

  for (let i = 1; i < equation.length; i += 2) {
    const operator = equation[i];
    const nextNumber = equation[i + 1];
    result = eval(`${result}${operator}${nextNumber}`);
  }

  return result;
}

let combinedEquationResult = 0;

for (const [index, equation] of Object.entries(parsedInput)) {
  console.log(`Resolving equation ${index} out of ${parsedInput.length}`);

  const { result, equationComponents } = equation;

  const possibleEquations = generatePossibleEquations(equationComponents);

  for (const equation of possibleEquations) {
    const equationResult = calcIgnorePrecedenceRule(equation);
    if (equationResult !== result) continue;
    combinedEquationResult += equationResult;
    break;
  }
}

console.log(combinedEquationResult);
