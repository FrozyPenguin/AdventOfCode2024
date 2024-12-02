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
