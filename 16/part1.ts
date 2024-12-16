import { Point } from "./../utils/classes/Point";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseGridInput } from "../utils/inputs";
import { GRID } from "../utils/types";

const START_NODE = "S";
const END_NODE = "E";
const WALL_NODE = "#";

const FORWARD_COST = 1;
const TURN_COST = 1000;

enum DIRECTION {
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
}

const DIRECTION_POINT: Record<DIRECTION, Point> = {
  [DIRECTION.LEFT]: new Point(-1, 0),
  [DIRECTION.RIGHT]: new Point(1, 0),
  [DIRECTION.TOP]: new Point(0, -1),
  [DIRECTION.BOTTOM]: new Point(0, 1),
};

type Node = { pos: Point; direction: DIRECTION; cost: number };

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const input = `#################
// #...#...#...#..E#
// #.#.#.#.#.#.#.#.#
// #.#.#.#...#...#.#
// #.#.#.#.###.#.#.#
// #...#.#.#.....#.#
// #.#.#.#.#.#####.#
// #.#...#.#.#.....#
// #.#.#####.#.###.#
// #.#.#.......#...#
// #.#.###.#####.###
// #.#.#...#.....#.#
// #.#.#.#####.###.#
// #.#.#.........#.#
// #.#.#.#########.#
// #S#.............#
// #################`;

function isAWall(pos: Point, grid: GRID) {
  return !grid[pos.y]?.[pos.x] || grid[pos.y]?.[pos.x] === WALL_NODE;
}

function stringToNode(nodeString: string): Node {
  const [stringPos, stringDir] = nodeString.split("|");
  return {
    pos: Point.fromString(stringPos),
    direction: DIRECTION[stringDir],
    cost: 0,
  };
}

function nodeToString({ pos, direction }: Node): string {
  return `${pos.toString()}|${DIRECTION[direction]}`;
}

function getPossibleNodesToMove(
  { pos, direction, cost }: Node,
  grid: GRID
): Node[] {
  const possibleNodes: Node[] = [];
  const possibleDirections = Object.keys(DIRECTION).filter((dir) =>
    isNaN(+dir)
  );
  for (const possibleDirection of possibleDirections) {
    const translation = DIRECTION_POINT[DIRECTION[possibleDirection]];
    const nodePos = pos.translate(translation);
    if (
      isAWall(nodePos, grid) ||
      translation.isSame(DIRECTION_POINT[direction].inverse())
    )
      continue;
    possibleNodes.push({
      pos: nodePos,
      direction: DIRECTION[possibleDirection],
      cost:
        (DIRECTION[possibleDirection] === direction
          ? FORWARD_COST
          : TURN_COST + FORWARD_COST) + cost,
    });
  }
  return possibleNodes;
}

const maze: GRID = parseGridInput(input);

const startNode: Node = {
  pos: new Point(0, 0),
  direction: DIRECTION.RIGHT,
  cost: 0,
};
const endNode: Point = new Point(0, 0);

for (let y = 0; y < maze.length; y++) {
  for (let x = 0; x < maze[y].length; x++) {
    if (maze[y][x] === START_NODE) startNode.pos.moveTo(new Point(x, y));
    if (maze[y][x] === END_NODE) endNode.moveTo(new Point(x, y));
  }
}

const seen: Set<string> = new Set<string>();
const queue: Node[] = [];

queue.push(startNode);

while (queue.length) {
  const node = queue.shift()!;
  seen.add(nodeToString(node));

  if (node.pos.isSame(endNode)) {
    console.log(node.cost);
    break;
  }

  const possibleMoves = getPossibleNodesToMove(node, maze).filter(
    (node) => !seen.has(nodeToString(node))
  );
  possibleMoves.sort((a, b) => a.cost - b.cost);

  if (possibleMoves.length) queue.push(...possibleMoves);
  queue.sort((a, b) => a.cost - b.cost);
}

// const minimumCost = sum(...[...seen].map((node) => stringToNode(node).cost));
// console.log(minimumCost);
