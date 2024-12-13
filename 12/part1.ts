import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseGridInput } from "../utils/inputs";
import { GRID } from "../utils/types";
import { Point } from "../utils/classes/Point";
import { sum } from "../utils/math";

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const input = `RRRRIICCFF
// RRRRIICCCF
// VVRRRCCFFF
// VVRCCCJFFF
// VVVVCJJCFE
// VVIVCCJJEE
// VVIIICJJEE
// MIIIIIJJEE
// MIIISIJEEE
// MMMISSJEEE`;

const grid: GRID = parseGridInput(input);

const visited = new Set<string>();
const regions: Array<{
  type: string;
  plants: Point[];
  perimeter: number;
  area: number;
}> = [];

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

function getRegion(
  plant: Point,
  grid: GRID,
  startPoint = plant,
  visitedPlantInRegion = new Set<string>()
): (typeof regions)[number] {
  const plantType = grid[plant.y][plant.x];
  const sides = getAllSides(plant);
  let perimeter = 0;
  let area = 1;
  const plantsInRegion = [plant];
  visitedPlantInRegion.add(plant.toString());

  for (const side of sides) {
    const sideType = grid[side.y]?.[side.x];

    if (sideType !== plantType) {
      perimeter++;
      continue;
    }

    if (
      !sideType ||
      side.toString() === startPoint.toString() ||
      visitedPlantInRegion.has(side.toString())
    )
      continue;

    const {
      plants: sidePlantRegions,
      perimeter: sidePerimeter,
      area: sideArea,
    } = getRegion(side, grid, startPoint, visitedPlantInRegion);
    perimeter += sidePerimeter;
    plantsInRegion.push(...sidePlantRegions);
    area += sideArea;
  }

  return {
    perimeter,
    area,
    plants: plantsInRegion,
    type: plantType,
  };
}

for (const [y, line] of Object.entries(grid)) {
  for (const [x] of Object.entries(line)) {
    const plant = new Point(Number.parseInt(x), Number.parseInt(y));
    if (visited.has(plant.toString())) continue;

    const region = getRegion(plant, grid);
    regions.push(region);

    for (const plantInRegion of region.plants) {
      visited.add(plantInRegion.toString());
    }
  }
}

const prices = sum(...regions.map((region) => region.area * region.perimeter));

console.log(prices);
