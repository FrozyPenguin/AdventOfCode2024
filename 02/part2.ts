import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseNumberInput } from "../utils/inputs";
import { diff } from "../utils/math";

const MAX_DIFF = 3;
const MIN_DIFF = 1;

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

const input2 = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input2.txt"),
  {
    encoding: "utf-8",
  }
);

const parsedInput: Array<number[]> = parseNumberInput(input);
const parsedInput2: Array<number[]> = parseNumberInput(input2);

console.log(parsedInput.filter(isReallySafe).length);
console.log(parsedInput2.filter(isReallySafe).length);

// console.log(isReallySafe([1, 3, 2, 4, 5]));
// console.log(isReallySafe([5, 4, 2, 3, 1]));

function isReallySafe(report: number[]) {
  const safe = isSafe(report);

  if (safe) return safe;

  for (let j = 0; j < report.length; j++) {
    const newReport = [...report];
    newReport.splice(j, 1);
    if (isSafe(newReport)) {
      return true;
    }
  }
}

function isSafe(report: number[]): boolean {
  for (let i = 0; i < report.length - 2; i++) {
    const diffResult = diff(report[i], report[i + 1]);
    const nextDiffResult = diff(report[i + 1], report[i + 2]);
    const absDiff = Math.abs(diffResult);
    const nextAbsDiff = Math.abs(nextDiffResult);
    const isInRange = absDiff <= MAX_DIFF && absDiff >= MIN_DIFF;
    const nextIsInRange = nextAbsDiff <= MAX_DIFF && nextAbsDiff >= MIN_DIFF;
    const isDecreasingOrIncreasing =
      (diffResult < 0 && nextDiffResult < 0) ||
      (diffResult > 0 && nextDiffResult > 0);

    if (!isInRange || !nextIsInRange || !isDecreasingOrIncreasing) {
      return false;
    }
  }

  return true;
}
