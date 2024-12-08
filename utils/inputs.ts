import { GRID } from "./types";

export function parseNumberInput(input: string): Array<number[]> {
  return input
    .split(/[\r\n]+/)
    .map((line) => line.split(/\s+/).map((number) => Number.parseInt(number)));
}

export function parseGridInput(input: string): GRID {
  const grid: GRID = input.split(/[\r\n]+/).map((line) => line.split(""));
  return grid;
}
