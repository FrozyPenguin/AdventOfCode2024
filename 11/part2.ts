import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseNumberInput } from "../utils/inputs";
import { sum } from "../utils/math";

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

function blink(stones: number[], times: number = 1): Map<number, number> {
  const stoneMap = new Map<number, number>(stones.map((stone) => [stone, 1]));
  for (let i = 0; i < times; i++) {
    const oldStonesMap = new Map<number, number>(stoneMap);
    stoneMap.clear();
    for (const [stone, count] of oldStonesMap) {
      const newStones = getNewStoneEngraving(stone);
      for (const newStone of newStones) {
        stoneMap.set(newStone, (stoneMap.get(newStone) || 0) + count);
      }
    }
  }
  return stoneMap;
}

console.log(sum(...blink(stones, 75).values()));
