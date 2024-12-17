import * as fs from "node:fs/promises";
import * as path from "node:path";

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const input = `
// Register A: 729
// Register B: 0
// Register C: 0

// Program: 0,1,5,4,3,0
// `;

const [registerA, registerB, registerC, program] = input.match(
  /(?<=Register [A-C]:\s)\d+|(?<=Program: )[\d,]+/g
)!;

enum Register {
  A,
  B,
  C,
}

let instructionPointer = 0;

const registers = {
  [Register.A]: Number.parseInt(registerA),
  [Register.B]: Number.parseInt(registerB),
  [Register.C]: Number.parseInt(registerC),
};

function getRegisterValue(register: Register) {
  return registers[register];
}

// function addToRegister(register: Register, value: number) {
//   registers[register] = registers[register] + value;
// }

function setRegister(register: Register, value: number) {
  registers[register] = value;
}

const OPERANDS = {
  0: () => 0,
  1: () => 1,
  2: () => 2,
  3: () => 3,
  4: () => getRegisterValue(Register.A),
  5: () => getRegisterValue(Register.B),
  6: () => getRegisterValue(Register.C),
  7: () => null,
};

function adv(value: number) {
  const comboOperand = OPERANDS[value]();
  const result = getRegisterValue(Register.A) / Math.pow(2, comboOperand);
  setRegister(Register.A, Math.trunc(result));
  instructionPointer += 2;
}

function bxl(value: number) {
  const result = getRegisterValue(Register.B) ^ value;
  setRegister(Register.B, result);
  instructionPointer += 2;
}

function bst(value: number) {
  const comboOperand = OPERANDS[value]();
  const result = comboOperand % 8;
  setRegister(Register.B, result);
  instructionPointer += 2;
}

function jnz(value: number) {
  const registerAValue = getRegisterValue(Register.A);
  if (registerAValue === 0) {
    instructionPointer += 2;
    return;
  }
  instructionPointer = value;
}

function bxc(_value: number) {
  const registerB = getRegisterValue(Register.B);
  const registerC = getRegisterValue(Register.C);
  const result = registerB ^ registerC;
  setRegister(Register.B, result);
  instructionPointer += 2;
}

function out(value: number) {
  const comboOperand = OPERANDS[value]();
  const result = comboOperand % 8;
  instructionPointer += 2;
  return result;
}

function bdv(value: number) {
  const comboOperand = OPERANDS[value]();
  const result = getRegisterValue(Register.A) / Math.pow(2, comboOperand);
  setRegister(Register.B, Math.trunc(result));
  instructionPointer += 2;
}

function cdv(value: number) {
  const comboOperand = OPERANDS[value]();
  const result = getRegisterValue(Register.A) / Math.pow(2, comboOperand);
  setRegister(Register.C, Math.trunc(result));
  instructionPointer += 2;
}

const INSTRUCTIONS = {
  0: adv,
  1: bxl,
  2: bst,
  3: jnz,
  4: bxc,
  5: out,
  6: bdv,
  7: cdv,
};

// console.log(registerA, registerB, registerC, program);

const programInstructions = program
  .split(",")
  .map((value) => Number.parseInt(value));

const result: number[] = [];

while (instructionPointer < programInstructions.length) {
  const opCode = programInstructions[instructionPointer];
  const operand = programInstructions[instructionPointer + 1];
  const output = INSTRUCTIONS[opCode](operand);

  if (output == null) continue;

  result.push(output);
}

console.log(result.join());
