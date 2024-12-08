import { GRID } from "./types";

export function getStringGrid(grid: GRID) {
  const textGrid = grid.map((line) => line.join("")).join("\n");
  return textGrid;
}
