import * as fs from "node:fs/promises";
import * as path from "node:path";

type Rule = [number, number];

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const input = `47|53
// 97|13
// 97|61
// 97|47
// 75|29
// 61|13
// 75|53
// 29|13
// 97|29
// 53|29
// 61|53
// 97|53
// 61|29
// 47|13
// 75|47
// 97|75
// 47|61
// 75|61
// 47|29
// 75|13
// 53|13

// 75,47,61,53,29
// 97,61,53,29,13
// 75,29,13
// 75,97,47,61,53
// 61,13,29
// 97,13,75,29,47`;

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
  if (!manualCorrect) continue;

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
