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
const SMALL_BOX_ICON = "O";
const BIG_BOX_ICON = ["[", "]"];
const WALL_ICON = "#";
const EMPTY_SPOT = ".";
const MULTIPLIER = 100;

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const input = `##########
// #..O..O.O#
// #......O.#
// #.OO..O.O#
// #..O@..O.#
// #O#..O...#
// #O..O..O.#
// #.OO.O.OO#
// #....O...#
// ##########

// <vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
// vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
// ><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
// <<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
// ^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
// ^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
// >^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
// <><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
// ^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
// v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

const [warehouse, movements] = input.split(/(?:\r?\n){2,}/).map((part) =>
  part.startsWith(WALL_ICON)
    ? part.split(/(?:\r?\n)/).map((line) => line.split(""))
    : part
        .split(/(?:\r?\n)/)
        .join("")
        .split("")
        .map((move, index): Point => MOVES[move])
) as [GRID, Point[]];

function getNewTiles(tile: string): [string, string] {
  if (tile === WALL_ICON) return [WALL_ICON, WALL_ICON];
  if (tile === SMALL_BOX_ICON) return [...BIG_BOX_ICON] as [string, string];
  if (tile === ROBOT_ICON) return [ROBOT_ICON, EMPTY_SPOT];
  return [EMPTY_SPOT, EMPTY_SPOT];
}

function getNewWarehouse(originalWarehouse: GRID): GRID {
  const newWarehouse: GRID = [];
  for (let y = 0; y < originalWarehouse.length; y++) {
    const newLine: GRID[number] = [];
    for (let x = 0; x < originalWarehouse[y].length; x++) {
      newLine.push(
        ...getNewTiles(getElementOnGrid(new Point(x, y), originalWarehouse)!)
      );
    }
    newWarehouse.push(newLine);
  }
  return newWarehouse;
}

function getElementOnGrid(pos: Point, grid: GRID): Nullable<string> {
  return grid[pos.y]?.[pos.x] ?? null;
}

function isABigBox(pos: Point, grid: GRID): boolean {
  const currentElement = getElementOnGrid(pos, grid);
  return BIG_BOX_ICON.includes(currentElement!);
}

function getSecondBoxPartPos(pos: Point, grid: GRID): Point {
  const currentElement = getElementOnGrid(pos, grid);
  if (!currentElement) {
    throw new Error("Not a box");
  }
  const secondPos =
    currentElement === BIG_BOX_ICON[0]
      ? pos.translate(MOVES[MOVEMENT.RIGHT])
      : pos.translate(MOVES[MOVEMENT.LEFT]);
  return secondPos;
}

function elementCanBePush(pos: Point, direction: Point, grid: GRID): boolean {
  const nextPos = pos.translate(direction);
  const nextPosCurrentElement = getElementOnGrid(nextPos, grid);
  if (!nextPosCurrentElement || nextPosCurrentElement === WALL_ICON)
    return false;

  if (isABigBox(nextPos, grid)) {
    if (isABigBox(pos, grid)) {
      const secondBoxPart = getSecondBoxPartPos(pos, grid);
      if (nextPos.isSame(secondBoxPart)) return true;
    }
    return simulateBigBoxPush(nextPos, direction, grid);
  }
  return true;
}

function simulateBigBoxPush(pos: Point, direction: Point, grid: GRID): boolean {
  const secondPos = getSecondBoxPartPos(pos, grid);

  return (
    elementCanBePush(pos, direction, grid) &&
    elementCanBePush(secondPos, direction, grid)
  );
}

function simulatePush(pos: Point, direction: Point, grid: GRID): boolean {
  if (isABigBox(pos, grid)) return simulateBigBoxPush(pos, direction, grid);

  return elementCanBePush(pos, direction, grid);
}

function push(pos: Point, direction: Point, grid: GRID): Point {
  const canBePushed = simulatePush(pos, direction, grid);
  if (!canBePushed) return pos;

  if (isABigBox(pos, grid)) return pushBigBox(pos, direction, grid);

  const currentElement = getElementOnGrid(pos, grid)!;
  const nextPos = pos.translate(direction);
  const nextPosCurrentElement = getElementOnGrid(nextPos, grid)!;

  if (BIG_BOX_ICON.includes(nextPosCurrentElement)) {
    pushBigBox(nextPos, direction, grid);
  }

  grid[pos.y][pos.x] = EMPTY_SPOT;
  grid[nextPos.y][nextPos.x] = currentElement;
  return nextPos;
}

function pushBigBox(pos: Point, direction: Point, grid: GRID) {
  const canBePushed = simulatePush(pos, direction, grid);
  if (!canBePushed) return pos;
  const currentElement = getElementOnGrid(pos, grid)!;
  const secondPos = getSecondBoxPartPos(pos, grid);
  const secondPosElement = getElementOnGrid(secondPos, grid)!;

  const firstPartNextPos = pos.translate(direction);
  const secondPartNextPos = secondPos.translate(direction);

  const firstPartNextPosCurrentElement = getElementOnGrid(
    firstPartNextPos,
    grid
  )!;

  if (
    firstPartNextPosCurrentElement !== EMPTY_SPOT &&
    !firstPartNextPos.isSame(secondPos)
  ) {
    push(firstPartNextPos, direction, grid);
  }

  const secondPartNextPosCurrentElement = getElementOnGrid(
    secondPartNextPos,
    grid
  )!;
  if (secondPartNextPosCurrentElement !== EMPTY_SPOT) {
    push(secondPartNextPos, direction, grid);
  }

  grid[pos.y][pos.x] = EMPTY_SPOT;
  grid[secondPos.y][secondPos.x] = EMPTY_SPOT;
  grid[firstPartNextPos.y][firstPartNextPos.x] = currentElement;
  grid[secondPartNextPos.y][secondPartNextPos.x] = secondPosElement;
  return firstPartNextPos;
}

const robot: Point = new Point(0, 0);

const bigWarehouse = getNewWarehouse(warehouse);

// console.log(bigWarehouse.map((line) => line.join("")).join("\n"));

for (let y = 0; y < bigWarehouse.length; y++) {
  const robotX = bigWarehouse[y].findIndex((element) => element === ROBOT_ICON);
  if (robotX < 0) continue;

  robot.moveTo(new Point(robotX, y));
  break;
}

for (const [_index, move] of Object.entries(movements)) {
  const nextRobotPos = push(robot, move, bigWarehouse);
  robot.moveTo(nextRobotPos);
  // console.log(index);
  // console.log(bigWarehouse.map((line) => line.join("")).join("\n"));
  // console.log("\n");
}

let total = 0;
for (let y = 0; y < bigWarehouse.length; y++) {
  for (let x = 0; x < bigWarehouse[y].length; x++) {
    const element = getElementOnGrid(new Point(x, y), bigWarehouse);
    if (element !== BIG_BOX_ICON[0]) continue;

    total += MULTIPLIER * y + x;
  }
}

// console.log(warehouse.map((line) => line.join("")).join("\n"));
console.log(total);
