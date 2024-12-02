import * as fs from "node:fs/promises";
import * as path from "node:path";

const defaultTsCode = `
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseNumberInput } from "../utils/inputs";

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

const input2 = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input2.txt"),
  {
    encoding: "utf-8",
  }
);

const parsedInput: Array<number[]> = parseNumberInput(input);
const parsedInput2: Array<number[]> = parseNumberInput(input2);
`.trim();

const filesToCreate: (
  | {
      path: string;
      type: "folder";
    }
  | {
      path: string;
      type: "file";
      data: string;
    }
)[] = [
  {
    path: "datasets",
    type: "folder",
  },
  {
    path: "datasets/input.txt",
    type: "file",
    data: "",
  },
  {
    path: "datasets/input2.txt",
    type: "file",
    data: "",
  },
  {
    path: "part1.ts",
    type: "file",
    data: defaultTsCode,
  },
  {
    path: "part2.ts",
    type: "file",
    data: defaultTsCode,
  },
];

const [, , day] = process.argv;

function getFolderName(day?: string) {
  let folderName: string = day ?? "";
  if (!day) {
    const dayOfMonth = new Date().getDate().toString();
    folderName = dayOfMonth;
  }
  return folderName.padStart(2, "0");
}

async function createDirIfNotExists(path: string) {
  try {
    await fs.access(path);
  } catch (error) {
    await fs.mkdir(path);
  }
}

const folderName = getFolderName(day);

await createDirIfNotExists(folderName);

for (const file of filesToCreate) {
  const filePath = path.join(folderName, file.path);
  if (file.type === "folder") {
    await createDirIfNotExists(filePath);
    continue;
  }

  await fs.appendFile(filePath, file.data);
}
