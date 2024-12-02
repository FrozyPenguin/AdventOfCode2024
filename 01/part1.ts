import * as fs from "node:fs/promises";
import * as path from "node:path";
import { positiveDiff, sum } from "../utils/math";
import { parseInput } from "./utils";

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

const [list1, list2] = parseInput(input);

list1.sort();
list2.sort();

const result: number[] = [];

for (let i = 0; i < list1.length; i++) {
  const number1 = list1[i];
  const number2 = list2[i];
  result.push(positiveDiff(number1, number2));
}

console.log(sum(...result));
