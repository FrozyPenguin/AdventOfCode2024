import { parseNumberInput } from "../utils/inputs";

export function parseInput(input: string) {
  return parseNumberInput(input).reduce(
    (previous: [number[], number[]], current) => {
      previous[0].push(current[0]);
      previous[1].push(current[1]);
      return previous;
    },
    [[], []]
  );
}
