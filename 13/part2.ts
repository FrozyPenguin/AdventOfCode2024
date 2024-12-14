import { Point } from "./../utils/classes/Point";
import * as fs from "node:fs/promises";
import * as path from "node:path";

type ClawMachine = { A: Point; B: Point; prize: Point };

const machineInputRegex =
  /^Button A: X(?<xA>.*?), Y(?<yA>.*?)[\r\n]+Button B: X(?<xB>.*?), Y(?<yB>.*?)[\r\n]+Prize: X=(?<xPrize>.*?), Y=(?<yPrize>.*?)$/m;

const TOKEN_FOR_BUTTON_A_PRESS = 3;
const TOKEN_FOR_BUTTON_B_PRESS = 1;

const PRIZE_OFFSET = 10000000000000;

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const input = `
// Button A: X+94, Y+34
// Button B: X+22, Y+67
// Prize: X=8400, Y=5400

// Button A: X+26, Y+66
// Button B: X+67, Y+21
// Prize: X=12748, Y=12176

// Button A: X+17, Y+86
// Button B: X+84, Y+37
// Prize: X=7870, Y=6450

// Button A: X+69, Y+23
// Button B: X+27, Y+71
// Prize: X=18641, Y=10279
// `.trim();

const clawMachines: ClawMachine[] = input
  .trim()
  .split(/\n\s*\n/)
  .map((machine) => {
    const parameters = machine.match(machineInputRegex)!.groups!;
    return {
      A: new Point(
        Number.parseInt(parameters.xA),
        Number.parseInt(parameters.yA)
      ),
      B: new Point(
        Number.parseInt(parameters.xB),
        Number.parseInt(parameters.yB)
      ),
      prize: new Point(
        Number.parseInt(parameters.xPrize) + PRIZE_OFFSET,
        Number.parseInt(parameters.yPrize) + PRIZE_OFFSET
      ),
    };
  });

/*
prize.x = pointA.x * s + pointB.x * t
prize.y = pointA.y * s + pointB.y * t

prize.x * pointB.y = pointA.x * pointB.y * s + pointB.x * pointB.y * t
prize.y * pointB.x = pointA.y * pointB.x * s + pointB.y * pointB.x * t

pointA.x * pointB.y * s - pointA.y * pointB.x * s = prize.x * pointB.y - prize.y * pointB.x

(pointA.x * pointB.y - pointA.y * pointB.x) * s = prize.x * pointB.y - prize.y * pointB.x

s = (prize.x * pointB.y - prize.y * pointB.x) / (pointA.x * pointB.y - pointA.y * pointB.x)


pointA.x * s = prize.x - pointB.x * t
t = (prize.x - pointA.x * s) / pointB.x
*/

let totalTokens = 0;

for (const machine of clawMachines) {
  const { A: pointA, B: pointB, prize } = machine;

  const countOfAPress =
    (prize.x * pointB.y - prize.y * pointB.x) /
    (pointA.x * pointB.y - pointA.y * pointB.x);
  const countOfBPress = (prize.x - pointA.x * countOfAPress) / pointB.x;

  // Not solvable if numbers are fractionnal
  if (!isInteger(countOfAPress) || !isInteger(countOfBPress)) continue;

  totalTokens +=
    countOfAPress * TOKEN_FOR_BUTTON_A_PRESS +
    countOfBPress * TOKEN_FOR_BUTTON_B_PRESS;
}

function isInteger(number: number) {
  return number % 1 === 0;
}

console.log(totalTokens);
