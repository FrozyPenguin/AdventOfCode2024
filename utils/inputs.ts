export function parseNumberInput(input: string): Array<number[]> {
  return input
    .split(/[\r\n]+/)
    .map((line) => line.split(/\s+/).map((number) => Number.parseInt(number)));
}
