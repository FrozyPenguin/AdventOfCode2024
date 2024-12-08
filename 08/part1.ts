import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseGridInput } from "../utils/inputs";
import { GRID } from "../utils/types";
import { Point } from "../utils/classes/Point";

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

  while (antennas.length) {
    const antenna = antennas.shift()!;

    for (const alignedAntenna of antennas) {
      const translation1 = antenna.getTranslation(alignedAntenna).inverse();
      const translation2 = alignedAntenna.getTranslation(antenna).inverse();

      const antinode1 = antenna.translate(translation1);
      const antinode2 = alignedAntenna.translate(translation2);

      if (grid[antinode1.y]?.[antinode1.x]) {
        antinodes.add(antinode1.toString());
      }

      if (grid[antinode2.y]?.[antinode2.x]) {
        antinodes.add(antinode2.toString());
      }
    }
  }
}

console.log(antinodes.size);
