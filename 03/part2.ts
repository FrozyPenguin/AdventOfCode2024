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

const filteredInput = input
  .split("don't()")
  .map((part, index) => {
    if (index === 0) return part;
    const [_disabled, ...enabled] = part.split("do()");
    return enabled.length ? enabled.join() : "";
  })
  .filter((part) => !!part)
  .join();

const matches = filteredInput.matchAll(regex);

const multipliedNumbers = [...matches].map(
  ([, a, b]) => Number.parseInt(a) * Number.parseInt(b)
);

console.log(sum(...multipliedNumbers));
