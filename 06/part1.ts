import * as fs from "node:fs/promises";
import * as path from "node:path";
import { pauseForInteraction } from "./utils";

const GUARD_ICONS = ["^", ">", "v", "<"] as const;

type Coordinate = { x: number; y: number };

type GRID = Array<string[]>;

type Move = {
  icon: (typeof GUARD_ICONS)[number];
  coordinateAdder: Coordinate;
};

const PATH_MARKER = "X";

const WALL_MARKER = "#";

const SHOW_UPDATED_GRID = false;
const UPDATE_GRID = false;

const MOVEMENTS_ORDER: Move[] = [
  {
    icon: "^",
    coordinateAdder: {
      x: 0,
      y: -1,
    },
  },
  {
    icon: ">",
    coordinateAdder: {
      x: 1,
      y: 0,
    },
  },
  {
    icon: "v",
    coordinateAdder: {
      x: 0,
      y: 1,
    },
  },
  {
    icon: "<",
    coordinateAdder: {
      x: -1,
      y: 0,
    },
  },
];

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

const grid: GRID = input.split(/\n/).map((line) => line.split(""));

let { position, actualMovementIndex } = getGuardCoordinateAndMovement(grid);
const visitedPosition: Set<string> = new Set<string>();

while (true) {
  // Keep track of visited position. An already visited position should be ignored from tracking
  // A visited position is actual position on grid
  const stringifyPosition = `${position.x},${position.y}`;
  if (!visitedPosition.has(stringifyPosition)) {
    visitedPosition.add(stringifyPosition);
  }

  const transformationToApply = MOVEMENTS_ORDER[actualMovementIndex];
  const nextPosition: Coordinate = {
    x: position.x + transformationToApply.coordinateAdder.x,
    y: position.y + transformationToApply.coordinateAdder.y,
  };

  const nextPositionCharacter = grid[nextPosition.y]?.[nextPosition.x];

  // check if next position is outside grid (position === undefined). If so break while loop
  if (!nextPositionCharacter) {
    console.log(visitedPosition.size);
    process.exit(0);
  }

  // check if next position is a wall. If so turn right and continue
  if (nextPositionCharacter === WALL_MARKER) {
    actualMovementIndex = getMovementIndexAfterTurnRight(actualMovementIndex);
    continue;
  }

  // for visual purpose, update grid on each iteration if SHOW_UPDATED_GRID is true
  if (UPDATE_GRID) {
    grid[position.y][position.x] = PATH_MARKER;
    if (grid[nextPosition.y]?.[nextPosition.x]) {
      grid[nextPosition.y][nextPosition.x] =
        MOVEMENTS_ORDER[actualMovementIndex].icon;
    }
  }

  if (SHOW_UPDATED_GRID) {
    printGrid(grid);
    await pauseForInteraction();
  }

  position = nextPosition;
}

function getGuardCoordinateAndMovement(grid: GRID): {
  position: Coordinate;
  actualMovementIndex: number;
} {
  for (let y = 0; y < grid.length; y++) {
    const line = grid[y];
    for (const marker of GUARD_ICONS) {
      if (!line.includes(marker)) continue;
      const x = line.indexOf(marker);
      const movementIndex = MOVEMENTS_ORDER.findIndex(
        (move) => move.icon === marker
      );
      if (movementIndex < 0) throw new Error("Unknown guard movement");
      return { position: { x, y }, actualMovementIndex: movementIndex };
    }
  }
  throw new Error("Could not find Guard coordinate on grid");
}

function getMovementIndexAfterTurnRight(actualMovementIndex: number): number {
  return (actualMovementIndex + 1) % MOVEMENTS_ORDER.length;
}

function printGrid(grid: GRID) {
  console.clear();
  const textGrid = grid.map((line) => line.join("")).join("\n");
  console.log(textGrid);
}
