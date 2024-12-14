import { GRID } from "./../utils/types";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { multiply } from "../utils/math";
import { Point } from "./../utils/classes/Point";
import { deepClone } from "../utils/objects";

type Robot = { position: Point; velocity: Point };
type Room = { height: number; width: number };

const parserRegex = /p=(?<posX>.+?),(?<posY>.+?) v=(?<velX>.+?),(?<velY>.+?)$/;

const room: Room = { height: 103, width: 101 };

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const room: Room = { height: 7, width: 11 };

// const input = `p=0,4 v=3,-3
// p=6,3 v=-1,-3
// p=10,3 v=-1,2
// p=2,0 v=2,-1
// p=0,0 v=1,3
// p=3,0 v=-2,-2
// p=7,6 v=-1,-3
// p=3,0 v=-1,-2
// p=9,3 v=2,3
// p=7,3 v=-1,2
// p=2,4 v=2,-3
// p=9,5 v=-3,-3`;

const robots: Robot[] = input
  .trim()
  .split(/[\r\n]+/)
  .map((line) => {
    const [, posX, posY, velX, velY] = line.match(parserRegex)!;
    return {
      position: new Point(Number.parseInt(posX), Number.parseInt(posY)),
      velocity: new Point(Number.parseInt(velX), Number.parseInt(velY)),
    };
  });

function getNewRobotPosition({ position, velocity }: Robot, room: Room): Point {
  const xPos = (position.x + velocity.x + room.width) % room.width;
  const yPos = (position.y + velocity.y + room.height) % room.height;

  return new Point(xPos, yPos);
}

function getRobotsCountInQuarters(
  robots: Robot[],
  room: Room
): [number, number, number, number] {
  const quarters: [number, number, number, number] = [0, 0, 0, 0];

  const xLimit = Math.floor(room.width / 2);
  const yLimit = Math.floor(room.height / 2);

  for (let i = 0; i < robots.length; i++) {
    const { position } = robots[i];
    if (position.x === xLimit || position.y === yLimit) continue;
    const isLeft = position.x < xLimit;
    const isTop = position.y < yLimit;
    const index = (isTop ? 0 : 2) + (isLeft ? 0 : 1);
    quarters[index]++;
  }

  return quarters;
}

function getSafetyFactor(robots: Robot[], room: Room) {
  return multiply(...getRobotsCountInQuarters(robots, room));
}

function fillAndPrintGrid(grid: GRID, points: Point[]) {
  const newGrid: GRID = deepClone(grid);
  for (const pos of points) {
    newGrid[pos.y][pos.x] = "*";
  }
  console.log(newGrid.map((line) => line.join("")).join("\n"));
}

let minimumSafetyFactor = Infinity;
let bestIteration = 0;
let robotsPosition = new Set<string>();

let elapsedTime = 0;
while (elapsedTime < room.height * room.width) {
  for (const robot of robots) {
    const newPosition = getNewRobotPosition(robot, room);
    robot.position.moveTo(newPosition);
  }

  elapsedTime++;

  const safetyFactor = getSafetyFactor(robots, room);
  if (minimumSafetyFactor > safetyFactor) {
    minimumSafetyFactor = safetyFactor;
    bestIteration = elapsedTime;
    robotsPosition = new Set<string>(
      robots.map(({ position }) => position.toString())
    );
  }
}

const grid: GRID = new Array(room.height).fill(new Array(room.width).fill("."));
fillAndPrintGrid(
  grid,
  [...robotsPosition].map((pos) => Point.fromString(pos))
);

console.log(
  `Best safety factor : ${minimumSafetyFactor}, Best iteration (solution) : ${bestIteration}`
);
