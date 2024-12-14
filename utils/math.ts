export function positiveDiff(number1: number, number2: number): number {
  if (number1 > number2) return number1 - number2;
  return number2 - number1;
}

export function diff(number1: number, number2: number): number {
  return number1 - number2;
}

export function sum(...numbers: number[]): number {
  return numbers.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
}

export function average(...numbers: number[]): number {
  return sum(...numbers) / numbers.length;
}

export function multiply(...numbers: number[]): number {
  return numbers.reduce((accumulator, currentValue) => {
    return accumulator * currentValue;
  }, 1);
}
