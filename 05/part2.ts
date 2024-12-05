import * as fs from "node:fs/promises";
import * as path from "node:path";

type Rule = [number, number];

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

const [rules, manuals]: [Rule[], Array<number[]>] = input
  .split(/\n\s*\n/)
  .map((part) =>
    part
      .split(/\n/)
      .map((line) =>
        line.split(/[,|]/).map((number) => Number.parseInt(number))
      )
  ) as [Rule[], Array<number[]>];

let total = 0;
for (const manual of manuals) {
  const manualCorrect = checkRulesOnManual(rules, manual);
  if (manualCorrect) continue;
  sortManualMutate(rules, manual);

  const middleNumber = manual[Math.floor(manual.length / 2)];
  total += middleNumber;
}
console.log(total);

function isRuleCorrect(rule: Rule, manual: number[]) {
  return (
    !manual.includes(rule[0]) ||
    !manual.includes(rule[1]) ||
    manual.indexOf(rule[0]) < manual.indexOf(rule[1])
  );
}

function checkRulesOnManual(rules: Rule[], manual: number[]): boolean {
  return rules.every((rule) => isRuleCorrect(rule, manual));
}

function sortManualMutate(rules: Rule[], manual: number[]) {
  manual.sort((a, b) => {
    for (const rule of rules) {
      if (rule[0] === a && rule[1] === b) return -1;
      if (rule[0] === b && rule[1] === a) return 1;
    }
    return 0;
  });
}
