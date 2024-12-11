import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseNumberInput } from "../utils/inputs";

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const input = "125 17";

const stones: number[] = parseNumberInput(input)[0];

function getNewStoneEngraving(stone: number): number[] {
  if (stone === 0) return [1];
  const stringEngraving = stone.toString();
  if (stringEngraving.length % 2 === 0) {
    const middleIndex = stringEngraving.length / 2;
    return [
      Number.parseInt(stringEngraving.slice(0, middleIndex)),
      Number.parseInt(stringEngraving.slice(middleIndex)),
    ];
  }
  return [stone * 2024];
}

for (let i = 0; i < 25; i++) {
  const oldStones = [...stones];
  stones.splice(0, stones.length);
  for (const stone of oldStones) {
    stones.push(...getNewStoneEngraving(stone));
  }
}

console.log(stones.length);
