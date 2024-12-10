import { Point } from "./../utils/classes/Point";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseGridInput } from "../utils/inputs";
import { GRID } from "../utils/types";
import { sum } from "../utils/math";

const START_HEIGHT = 0;
const STEP_HEIGHT = 1;
const MAX_HEIGHT = 9;

enum SIDE {
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
}

const SIDE_POINT: Record<SIDE, Point> = {
  [SIDE.LEFT]: new Point(-1, 0),
  [SIDE.RIGHT]: new Point(1, 0),
  [SIDE.TOP]: new Point(0, -1),
  [SIDE.BOTTOM]: new Point(0, 1),
};

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const input = `89010123
// 78121874
// 87430965
// 96549874
// 45678903
// 32019012
// 01329801
// 10456732`;

const parsedInput: GRID = parseGridInput(input);

const trails: { startPoint: Point; possibleTrails: Array<Point[]> }[] = [];

for (let y = 0; y < parsedInput.length; y++) {
  const line = parsedInput[y];
  for (let x = 0; x < line.length; x++) {
    const height = Number.parseInt(line[x]);
    if (height !== START_HEIGHT) continue;

    const startPoint = new Point(x, y);
    const possibleTrails: Array<Point[]> = getTrails(
      startPoint,
      parsedInput,
      true
    );

    trails.push({ startPoint, possibleTrails });
  }
}

console.log(sum(...trails.map((trail) => trail.possibleTrails.length)));

function getSide(point: Point, side: SIDE) {
  return point.translate(SIDE_POINT[side]);
}

function getAllSides(point: Point) {
  return Object.keys(SIDE)
    .filter((key) => isNaN(Number.parseInt(key)))
    .map((side) => {
      return getSide(point, SIDE[side]);
    });
}

function getTrails(
  startPoint: Point,
  grid: GRID,
  keepAllPath: boolean = false
) {
  const sides = getAllSides(startPoint);
  const height = Number.parseInt(grid[startPoint.y]?.[startPoint.x]);

  const trails: Array<Point[]> = [];

  for (const side of sides) {
    const sidePointHeight = Number.parseInt(grid[side.y]?.[side.x]);
    if (isNaN(sidePointHeight) || sidePointHeight !== height + STEP_HEIGHT) {
      continue;
    }
    if (sidePointHeight === MAX_HEIGHT) {
      trails.push([startPoint, side]);
    }
    const trailsFromPoint = getTrails(side, grid, keepAllPath);
    for (const trail of trailsFromPoint) {
      if (
        !keepAllPath &&
        trails.some((path) => path.at(-1)?.isSame(trail.at(-1)!))
      )
        continue;
      trails.push([startPoint, ...trail]);
    }
  }

  return trails;
}
