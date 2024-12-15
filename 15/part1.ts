import { GRID, Nullable } from "./../utils/types";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Point } from "../utils/classes/Point";

enum MOVEMENT {
  TOP = "^",
  BOTTOM = "v",
  LEFT = "<",
  RIGHT = ">",
}

const MOVES: Record<MOVEMENT, Point> = {
  [MOVEMENT.TOP]: new Point(0, -1),
  [MOVEMENT.RIGHT]: new Point(1, 0),
  [MOVEMENT.BOTTOM]: new Point(0, 1),
  [MOVEMENT.LEFT]: new Point(-1, 0),
};

const ROBOT_ICON = "@";
const BOX_ICON = "O";
const WALL_ICON = "#";
const EMPTY_SPOT = ".";
const MULTIPLIER = 100;

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const input = `########
// #..O.O.#
// ##@.O..#
// #...O..#
// #.#.O..#
// #...O..#
// #......#
// ########

// <^^>>>vv<v>>v<<`;

const [warehouse, movements] = input.split(/(?:\r?\n){2,}/).map((part) =>
  part.startsWith(WALL_ICON)
    ? part.split(/(?:\r?\n)/).map((line) => line.split(""))
    : part
        .split(/(?:\r?\n)/)
        .join("")
        .split("")
        .map((move, index): Point => MOVES[move])
) as [GRID, Point[]];

function getElementOnGrid(pos: Point, grid: GRID): Nullable<string> {
  return grid[pos.y]?.[pos.x] ?? null;
}

function push(pos: Point, direction: Point, grid: GRID): Point {
  const currentElement = getElementOnGrid(pos, grid);
  if (!currentElement) return pos;
  const nextPos = pos.translate(direction);
  const nextPosCurrentElement = getElementOnGrid(nextPos, grid);
  if (!nextPosCurrentElement || nextPosCurrentElement === WALL_ICON) return pos;

  if (nextPosCurrentElement === BOX_ICON) {
    const newBoxPos = push(nextPos, direction, grid);
    if (newBoxPos.toString() === nextPos.toString()) return pos;
  }

  grid[pos.y][pos.x] = EMPTY_SPOT;
  grid[nextPos.y][nextPos.x] = currentElement;
  return nextPos;
}

const robot: Point = new Point(0, 0);

for (let y = 0; y < warehouse.length; y++) {
  const robotX = warehouse[y].findIndex((element) => element === ROBOT_ICON);
  if (robotX < 0) continue;

  robot.moveTo(new Point(robotX, y));
  break;
}

for (const move of movements) {
  const nextRobotPos = push(robot, move, warehouse);
  robot.moveTo(nextRobotPos);
  // console.log(warehouse.map((line) => line.join("")).join("\n"));
  // console.log("\n");
}

let total = 0;
for (let y = 0; y < warehouse.length; y++) {
  for (let x = 0; x < warehouse[y].length; x++) {
    const element = getElementOnGrid(new Point(x, y), warehouse);
    if (element !== BOX_ICON) continue;

    total += MULTIPLIER * y + x;
  }
}

// console.log(warehouse.map((line) => line.join("")).join("\n"));
console.log(total);
