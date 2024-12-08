import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseGridInput } from "../utils/inputs";
import { GRID } from "../utils/types";
import { Point } from "../utils/classes/Point";
import { deepClone } from "../utils/objects";
import { getStringGrid } from "../utils";

const EMPTY_SPACE = ".";

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const input = `............
// ........0...
// .....0......
// .......0....
// ....0.......
// ......A.....
// ............
// ............
// ........A...
// .........A..
// ............
// ............`;

const grid: GRID = parseGridInput(input);

const updatedGrid: GRID = deepClone(grid);

const antennasByType: Map<string, Point[]> = new Map<string, Point[]>();

for (let y = 0; y < grid.length; y++) {
  const line = grid[y];
  for (let x = 0; x < line.length; x++) {
    const character = grid[y][x];
    if (character === EMPTY_SPACE) continue;

    if (!antennasByType.has(character)) antennasByType.set(character, []);

    const antennas = antennasByType.get(character)!;

    antennas.push(new Point(x, y));
  }
}

const antinodes: Set<string> = new Set<string>();
for (const [, antennasCoordinates] of antennasByType) {
  const antennas = [...antennasCoordinates];
  const alignedAntennas: Map<Point, Point[]> = new Map<Point, Point[]>();

  while (antennas.length) {
    const antenna = antennas.shift()!;

    const alignedAntennasInformations = antennas.map(
      (otherAntenna) => otherAntenna
    );

    alignedAntennas.set(antenna, alignedAntennasInformations);
  }

  for (const [antenna, otherAntennas] of alignedAntennas) {
    for (const alignedAntenna of otherAntennas) {
      const translation1 = antenna.getTranslation(alignedAntenna).inverse();
      const translation2 = alignedAntenna.getTranslation(antenna).inverse();

      for (const node of [antenna, alignedAntenna]) {
        let antinode = node;
        for (const translation of [translation1, translation2]) {
          while (isTranslationPossible(grid, antinode, translation)) {
            antinode = antinode.translate(translation);
            antinodes.add(antinode.toString());
            updatedGrid[antinode.y][antinode.x] = "#";
          }
        }
      }
    }
  }
}

function isTranslationPossible(
  grid: GRID,
  point: Point,
  translation: Point
): boolean {
  const newPoint = point.translate(translation);
  return !!grid[newPoint.y]?.[newPoint.x];
}

console.log(getStringGrid(updatedGrid));
console.log(antinodes.size);
