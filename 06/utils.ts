import * as readline from "node:readline/promises";

let readLineInterface: ReturnType<typeof readline.createInterface> | undefined =
  undefined;
export async function pauseForInteraction() {
  if (!readLineInterface) {
    readLineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  await readLineInterface.question("Type Enter to jump to next iteration");
}
