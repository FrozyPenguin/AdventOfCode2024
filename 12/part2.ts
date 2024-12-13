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
  sides: number;
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

const DIAGONAL_POINT: Record<
  `${SIDE.TOP | SIDE.BOTTOM}_${SIDE.LEFT | SIDE.RIGHT}`,
  Point
> = {
  [`${SIDE.TOP}_${SIDE.LEFT}`]: SIDE_POINT[SIDE.TOP].translate(
    SIDE_POINT[SIDE.LEFT]
  ),
  [`${SIDE.TOP}_${SIDE.RIGHT}`]: SIDE_POINT[SIDE.TOP].translate(
    SIDE_POINT[SIDE.RIGHT]
  ),
  [`${SIDE.BOTTOM}_${SIDE.LEFT}`]: SIDE_POINT[SIDE.BOTTOM].translate(
    SIDE_POINT[SIDE.LEFT]
  ),
  [`${SIDE.BOTTOM}_${SIDE.RIGHT}`]: SIDE_POINT[SIDE.BOTTOM].translate(
    SIDE_POINT[SIDE.RIGHT]
  ),
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
  const plantType = getValueOnGrid(plant, grid)!;
  const sides = getAllSides(plant);
  let perimeter = 0;
  let area = 1;
  const plantsInRegion = [plant];
  visitedPlantInRegion.add(plant.toString());
  let corners = countCorners(plant, grid);

  for (const side of sides) {
    const sideType = getValueOnGrid(side, grid);

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
      sides: sideCorners,
    } = getRegion(side, grid, startPoint, visitedPlantInRegion);
    perimeter += sidePerimeter;
    plantsInRegion.push(...sidePlantRegions);
    area += sideArea;
    corners += sideCorners;
  }

  return {
    perimeter,
    area,
    plants: plantsInRegion,
    type: plantType,
    sides: corners,
  };
}

function countCorners(plant: Point, grid: GRID): number {
  let corners = 0;
  for (const key of Object.keys(DIAGONAL_POINT)) {
    if (
      !isInwardCorner(plant, grid, key as keyof typeof DIAGONAL_POINT) &&
      !isOutwardCorner(plant, grid, key as keyof typeof DIAGONAL_POINT)
    ) {
      continue;
    }
    corners++;
  }
  return corners;
}

function isInwardCorner(
  plant: Point,
  grid: GRID,
  diagonalKey: keyof typeof DIAGONAL_POINT
) {
  const plantType = getValueOnGrid(plant, grid);
  const [firstReferenceType, secondReferenceType] = diagonalKey
    .split("_")
    .map((key) => plant.translate(SIDE_POINT[key]))
    .map((point) => getValueOnGrid(point, grid));
  const diagonalType = getValueOnGrid(
    plant.translate(DIAGONAL_POINT[diagonalKey]),
    grid
  );

  return (
    firstReferenceType === plantType &&
    secondReferenceType === plantType &&
    diagonalType !== plantType
  );
}

function isOutwardCorner(
  plant: Point,
  grid: GRID,
  diagonalKey: keyof typeof DIAGONAL_POINT
) {
  const plantType = getValueOnGrid(plant, grid);
  const [firstReferenceType, secondReferenceType] = diagonalKey
    .split("_")
    .map((key) => plant.translate(SIDE_POINT[key]))
    .map((point) => getValueOnGrid(point, grid));

  return firstReferenceType !== plantType && secondReferenceType !== plantType;
}

function getValueOnGrid(point: Point, grid: GRID): string | undefined {
  return grid[point.y]?.[point.x];
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

const prices = sum(...regions.map((region) => region.area * region.sides));

console.log(prices);
