import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseInput } from "./utils";

const input = await fs.readFile(
  path.join(import.meta.dirname, "dataset/input.txt"),
  {
    encoding: "utf-8",
  }
);

const [leftList, rightList] = parseInput(input);

const rightListSimilarity = new Map<number, number>();

for (const number of rightList) {
  rightListSimilarity.set(
    number,
    number + (rightListSimilarity.get(number) ?? 0)
  );
}

let similarityScoreLeftList = 0;

for (const number of leftList) {
  similarityScoreLeftList += rightListSimilarity.get(number) ?? 0;
}

console.log(similarityScoreLeftList);
