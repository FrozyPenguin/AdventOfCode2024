import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseNumberInput } from "../utils/inputs";

const input = await fs.readFile(
  path.join(import.meta.dirname, "dataset/input.txt"),
  {
    encoding: "utf-8",
  }
);

const parsedInput: Array<number[]> = parseNumberInput(input);