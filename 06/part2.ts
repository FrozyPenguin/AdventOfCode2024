import * as fs from "node:fs/promises";
import * as path from "node:path";
import { pauseForInteraction } from "./utils";
import { deepClone } from "../utils/objects";

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

// const input = `....#.....
// .........#
// ..........
// ..#.......
// .......#..
// ..........
// .#..^.....
// ........#.
// #.........
// ......#...`;

const baseGrid: GRID = input.split(/\n/).map((line) => line.split(""));

let { position: initialPosition, actualMovementIndex } =
  getGuardCoordinateAndMovement(baseGrid);
const { loop, visitedPositions } = await simulate(deepClone(baseGrid), {
  position: initialPosition,
  actualMovementIndex,
});

let possibleLoops = 0;

if (loop) {
  possibleLoops++;
  console.log(possibleLoops);
  process.exit(0);
}

for (const position of visitedPositions) {
  const gridClone = deepClone(baseGrid);

  const [x, y] = position.split(",");

  if (GUARD_ICONS.includes(gridClone[y][x])) {
    continue;
  }

  gridClone[y][x] = WALL_MARKER;

  const { loop } = await simulate(gridClone, {
    position: initialPosition,
    actualMovementIndex,
  });

  if (loop) {
    possibleLoops++;
  }
}

console.log(possibleLoops);
process.exit(0);

async function simulate(
  grid: GRID,
  startInformations: ReturnType<typeof getGuardCoordinateAndMovement>,
  options: { updateGrid: boolean; showUpdatedGrid: boolean } = {
    updateGrid: UPDATE_GRID,
    showUpdatedGrid: SHOW_UPDATED_GRID,
  }
): Promise<{ loop: boolean; visitedPositions: Set<string> }> {
  let { position, actualMovementIndex } = startInformations;
  const visitedPositions: Map<string, Set<Coordinate>> = new Map<
    string,
    Set<Coordinate>
  >();

  while (true) {
    // Keep track of visited position. An already visited position should be ignored from tracking
    // A visited position is actual position on grid
    const stringifyPosition = `${position.x},${position.y}`;
    if (!visitedPositions.has(stringifyPosition)) {
      visitedPositions.set(stringifyPosition, new Set<Coordinate>());
    }

    const transformationToApply = MOVEMENTS_ORDER[actualMovementIndex];

    if (
      visitedPositions.has(stringifyPosition) &&
      visitedPositions
        .get(stringifyPosition)
        ?.has(transformationToApply.coordinateAdder)
    ) {
      return {
        loop: true,
        visitedPositions: new Set<string>(visitedPositions.keys()),
      };
    }

    const nextPosition: Coordinate = {
      x: position.x + transformationToApply.coordinateAdder.x,
      y: position.y + transformationToApply.coordinateAdder.y,
    };

    const registeredDirections = visitedPositions.get(stringifyPosition);
    registeredDirections?.add(transformationToApply.coordinateAdder);

    const nextPositionCharacter = grid[nextPosition.y]?.[nextPosition.x];

    // check if next position is outside grid (position === undefined). If so break while loop
    if (!nextPositionCharacter) {
      return {
        loop: false,
        visitedPositions: new Set<string>(visitedPositions.keys()),
      };
    }

    // check if next position is a wall. If so turn right and continue
    if (nextPositionCharacter === WALL_MARKER) {
      actualMovementIndex = getMovementIndexAfterTurnRight(actualMovementIndex);
      continue;
    }

    // for visual purpose, update grid on each iteration if SHOW_UPDATED_GRID is true
    if (options.updateGrid) {
      grid[position.y][position.x] = PATH_MARKER;
      if (grid[nextPosition.y]?.[nextPosition.x]) {
        grid[nextPosition.y][nextPosition.x] =
          MOVEMENTS_ORDER[actualMovementIndex].icon;
      }
    }

    if (options.showUpdatedGrid) {
      printGrid(grid);
      await pauseForInteraction();
    }

    position = nextPosition;
  }
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
