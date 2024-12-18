import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Point } from "../utils/classes/Point";

type Node = {
  pos: Point;
  cost: number;
  path: Set<string>;
};

const MOVES: Point[] = [
  new Point(0, -1),
  new Point(1, 0),
  new Point(0, 1),
  new Point(-1, 0),
];

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

const size = 71;

const sample = 1024;

// const input = `5,4
// 4,2
// 4,5
// 3,0
// 2,1
// 6,3
// 2,4
// 1,5
// 0,6
// 3,3
// 2,6
// 5,1
// 1,2
// 5,5
// 2,5
// 6,5
// 1,4
// 0,4
// 6,4
// 1,1
// 6,1
// 1,0
// 0,5
// 1,6
// 2,0`;

// const corruptedRamCoordinates: Point[] = input
//   .split(/(\r\n)+/g)
//   .map((value) => value.split(","))
//   .map(([x, y]) => new Point(+x, +y));

function getPossibleNodesToMove(
  { pos, cost, path }: Node,
  corruptedPoint: Set<string>,
  maxSize: number
): Node[] {
  const possibleNodes: Node[] = [];
  for (const move of MOVES) {
    const nodePos = pos.translate(move);
    if (
      nodePos.x >= maxSize ||
      nodePos.x < 0 ||
      nodePos.y >= maxSize ||
      nodePos.y < 0 ||
      corruptedPoint.has(nodePos.toString()) ||
      path.has(nodePos.toString())
    )
      continue;

    possibleNodes.push({
      pos: nodePos,
      cost: cost + 1,
      path: new Set<string>([...path, pos.toString()]),
    });
  }
  return possibleNodes;
}

const corruptedRamCoordinates: Set<string> = new Set(
  input.split(/[\r\n]+/g).slice(0, sample)
);

const startPoint = new Point(0, 0);
const endPoint = new Point(size - 1, size - 1);

const visitedNodes: Set<string> = new Set();
const paths: Node["path"][] = [];
const queue: Node[] = [{ pos: startPoint, cost: 0, path: new Set() }];

while (queue.length) {
  const node = queue.pop()!;
  if (visitedNodes.has(node.pos.toString())) continue;

  visitedNodes.add(node.pos.toString());

  if (node.pos.isSame(endPoint)) {
    // node.path.add(endPoint.toString());
    paths.push(node.path);
    break;
  }

  const moves = getPossibleNodesToMove(
    node,
    corruptedRamCoordinates,
    size
  ).filter((node) => !visitedNodes.has(node.pos.toString()));
  moves.sort((a, b) => b.cost - a.cost);

  if (!moves) continue;
  queue.push(...moves);
  queue.sort((a, b) => b.cost - a.cost);
}

console.log(paths[0].size);
