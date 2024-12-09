import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Nullable } from "../utils/types";
import { deepClone, deepEqual } from "../utils/objects";
import { sum } from "../utils/math";

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

const FREE_SPACE = ".";

// const input = `2333133121414131402`;

const parsedInput: number[] = input
  .split("")
  .map((value) => Number.parseInt(value));

const memoryRepresentation = buildMemoryRepresentation(parsedInput);

function compactMemory(memory: Array<string[]>) {
  const blocks = deepClone(memory);

  const nonEmptyBlocks = blocks.filter((block) => !isEmptyBlock(block));

  for (let i = nonEmptyBlocks.length - 1; i > 0; i--) {
    const block = nonEmptyBlocks[i];
    const spaceIndexToInsert = findBlockSpaceIndexToInsert(blocks, block);
    if (spaceIndexToInsert === null) continue;

    const currentBlockPosition = blocks.findIndex((value) => block === value);
    const [leftSibling, rightSibling] = [
      blocks[currentBlockPosition - 1],
      blocks[currentBlockPosition + 1],
    ];

    const newFreeSpace = new Array<typeof FREE_SPACE>(block.length).fill(
      FREE_SPACE
    );

    handleBlockMerging(
      blocks,
      currentBlockPosition,
      leftSibling,
      rightSibling,
      newFreeSpace
    );

    insertBlockAtSpace(blocks, block, spaceIndexToInsert);
  }

  return blocks;
}

const compactedMemory = compactMemory(memoryRepresentation);

const result = sum(
  ...compactedMemory
    .flat()
    .map((value, index) =>
      value === FREE_SPACE ? 0 : Number.parseInt(value) * index
    )
);

console.log(result);

function buildMemoryRepresentation(input: number[]): Array<string[]> {
  const result: Array<string[]> = [];

  let blockIndex = 0;
  for (const [inputIndex, number] of Object.entries(input)) {
    const isFreeSpace = Number.parseInt(inputIndex) % 2 !== 0;
    const filler = isFreeSpace ? FREE_SPACE : blockIndex.toString();
    const toInsert = new Array<string>(number).fill(filler);
    result.push(toInsert);
    if (!isFreeSpace) blockIndex++;
  }

  return result;
}

function findBlockSpaceIndexToInsert(
  blocks: Array<string[]>,
  blockToInsert: string[]
): Nullable<number> {
  const firstEmptyBlockAvailableToInsert = blocks.findIndex(
    (block) => isEmptyBlock(block) && block.length >= blockToInsert.length
  );
  const currentBlockIndex = blocks.findIndex((block) =>
    deepEqual(block, blockToInsert)
  );

  return firstEmptyBlockAvailableToInsert < 0 ||
    firstEmptyBlockAvailableToInsert > currentBlockIndex
    ? null
    : firstEmptyBlockAvailableToInsert;
}

function isEmptyBlock(block: string[]) {
  return block.every((value) => value === FREE_SPACE);
}

function handleBlockMerging(
  blocks: Array<string[]>,
  blockPosition: number,
  leftSibling: string[] | undefined,
  rightSibling: string[] | undefined,
  newFreeSpace: string[]
): void {
  if (canMergeWithBothSides(leftSibling, rightSibling)) {
    leftSibling!.push(...newFreeSpace, ...rightSibling!);
    blocks.splice(blockPosition, 2);
  } else if (canMergeWithSide(rightSibling)) {
    rightSibling!.push(...newFreeSpace);
    blocks.splice(blockPosition, 1);
  } else if (canMergeWithSide(leftSibling)) {
    leftSibling!.push(...newFreeSpace);
    blocks.splice(blockPosition, 1);
  } else {
    blocks[blockPosition] = newFreeSpace;
  }
}

function canMergeWithBothSides(left?: string[], right?: string[]): boolean {
  return !!left && !!right && isEmptyBlock(left) && isEmptyBlock(right);
}

function canMergeWithSide(side?: string[]): boolean {
  return !!side && isEmptyBlock(side);
}

function insertBlockAtSpace(
  blocks: Array<string[]>,
  block: string[],
  spaceIndexToInsert: number
): void {
  const emptySpaceToInsert = blocks[spaceIndexToInsert];
  let remainingFreeSpace = emptySpaceToInsert.slice(block.length);

  const nextBlock: string[] = blocks[spaceIndexToInsert + 1];
  if (nextBlock?.length && isEmptyBlock(nextBlock)) {
    blocks[spaceIndexToInsert + 1].push(...remainingFreeSpace);
    remainingFreeSpace = [];
  }

  if (remainingFreeSpace.length) {
    blocks.splice(spaceIndexToInsert, 1, block, remainingFreeSpace);
  } else {
    blocks.splice(spaceIndexToInsert, 1, block);
  }
}
