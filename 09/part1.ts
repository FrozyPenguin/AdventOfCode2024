import * as fs from "node:fs/promises";
import * as path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

const FREE_SPACE = ".";

// const input = `2333133121414131402`;
// const expectedOutput = `0099811188827773336446555566..............`;

const parsedInput: number[] = input
  .split("")
  .map((value) => Number.parseInt(value));

const memoryRepresentation = buildMemoryRepresentation(parsedInput);

let readPointer = memoryRepresentation.length - 1;
let writePointer = 0;

while (writePointer < readPointer) {
  while (
    writePointer < readPointer &&
    memoryRepresentation[writePointer] !== FREE_SPACE
  ) {
    writePointer++;
  }

  while (
    writePointer < readPointer &&
    memoryRepresentation[readPointer] === FREE_SPACE
  ) {
    readPointer--;
  }

  if (writePointer >= readPointer) continue;

  memoryRepresentation[writePointer] = memoryRepresentation[readPointer];
  memoryRepresentation[readPointer] = FREE_SPACE;
}

const fileBlockWithoutFreeSpace = memoryRepresentation.slice(
  0,
  memoryRepresentation.indexOf(FREE_SPACE)
);

const result = fileBlockWithoutFreeSpace.reduce(
  (previous, current, index) => previous + Number.parseInt(current) * index,
  0
);

console.log(result);

function buildMemoryRepresentation(input: number[]): string[] {
  const result: string[] = [];

  let blockIndex = 0;
  for (const [inputIndex, number] of Object.entries(input)) {
    const isFreeSpace = Number.parseInt(inputIndex) % 2 !== 0;
    const filler = isFreeSpace ? FREE_SPACE : blockIndex.toString();
    const toInsert = new Array<string>(number).fill(filler);
    result.push(...toInsert);
    if (!isFreeSpace) blockIndex++;
  }

  return result;
}
