import * as fs from "node:fs/promises";
import * as path from "node:path";
import { sum } from "../utils/math";

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

const regex = /mul\((?<number1>\d+?),(?<number2>\d+?)\)/g;

const matches = input.matchAll(regex);

const multipliedNumbers = [...matches].map(
  ([, a, b]) => Number.parseInt(a) * Number.parseInt(b)
);

console.log(sum(...multipliedNumbers));
