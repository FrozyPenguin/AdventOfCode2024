import * as fs from "node:fs/promises";
import * as path from "node:path";
import { sum } from "../utils/math";

const input = await fs.readFile(
  path.join(import.meta.dirname, "datasets/input.txt"),
  {
    encoding: "utf-8",
  }
);

// const input = `r, wr, b, g, bwu, rb, gb, br

// brwrr
// bggr
// gbbr
// rrbgbr
// ubwu
// bwurrg
// brgr
// bbrgwb`;

// const input = `rwwrww, uuwbwr, wgw, wuurr, urru, grrbr, gbg, bwgwguw, rwgruug, wbrb, ubb, brgub, bwg, rwg, uruubg, wwwbw, grr, brggug, wgbr, rurr, guwuuwur, rbrubbw, gbru, ggwu, urwbwg, bgg, buu, gggbgw, buwr, bgrb, ugr, rbwubb, gurrb, bbw, brgwgb, wrwu, gbggwru, ggbuu, wrg, rrw, gbb, gwr, gg, rgw, rwwrb, rbg, wurgww, rgr, bwub, bruw, ruwbr, rgbwww, uwbrw, buuu, ubbgg, buug, rug, bgrw, gbbr, burrrbwr, rrubug, bwguu, uuwrbu, uuur, gubr, www, rub, gbr, uggguw, bbrwu, gwgu, gug, rruuru, wwggg, gwg, gubgbrww, uwr, gb, rubb, uggbr, brrb, gu, uugr, ggg, rbu, r, rbubuwrw, bbruu, wgrb, ggrwuu, wgbub, wb, urwurb, gwwggr, wwbbr, uuu, gggrrb, bgr, bb, rwwgwg, buuwg, guurgg, uwwb, ugb, ugrr, gbw, wr, gw, rbbuwu, br, buurw, ugu, rrb, rbrw, wwubu, wrbuu, uubr, bbbruuw, rubbuwu, rubwb, ub, wbr, ru, brrw, wgwu, wubgbr, burbu, ubu, gub, wrgwrwrw, urg, gr, rrr, uuww, rwwrwuuw, ubgwwg, ggwwg, buuwr, rugbww, rrru, wbuuw, uu, gubgr, gru, buub, uruw, rugbbbrb, uugbww, bbrrru, uwgbgur, wrrr, grb, wrbbw, wgbubb, ur, bgw, bwwg, bubrb, guwgg, ggbw, ggwugrbg, gwrgur, ggwww, brr, rgbugr, uuuu, ggu, guwbw, wwwwrb, urwwu, gbrurgg, buwggwg, gurb, rbgrg, urbrgr, rwr, ugwbr, wrwg, brw, uugb, bwwu, ugub, ububbg, gbuu, rbrww, ubguwr, uuurrg, uwuugw, wrb, guu, wbu, rrgbrur, uurr, ggr, wgu, ruurug, uwrwwg, rugwg, bbbw, rbwwgrg, bub, uubb, rru, bburg, uwrwu, guwu, wwugwrr, wggbbbg, b, uubbg, rgbrg, urrb, gbgb, gwbwg, grww, uru, bgb, gwu, bbwg, burw, wggbrbru, uuwg, wurwu, wgr, brwb, bwug, ruruw, uguwu, bbb, gbgwuub, brb, ugwb, grrgb, wgbwb, wwr, wbg, wgb, rwb, bwubg, gruwb, wgg, grg, wuwb, rbrbuwb, wwgwb, bwgurww, bwwr, bgrwg, rrrgbg, wgwwguwb, rwbuw, guwgbwr, wu, uwbb, bwr, ggur, rrg, gbwuwgg, gbwwr, ubwgwwr, wwbb, ugg, gurw, uwwu, bwu, bug, rrurgg, wbrg, wgwruu, uwwugw, guw, ubrb, gbwwu, wguwbw, ggguwwb, rgu, wrw, ruu, uggbug, ubg, w, wbgw, bwrbbur, rrugbr, uug, rurbb, wur, wub, bwb, rww, bgrggrg, ggwb, brg, gwb, wwbu, rbggg, gwugr, ugwurbrb, uur, ugrwbr, bugwu, ggbgru, rgg, ugw, uwwuwwbr, ug, grgbbgg, rwbgrggb, uwur, wrgb, gur, gww, bgu, ubuub, gwwburr, ubbrwugu, rr, rbb, bwguubb, gbuuwwub, wug, wuug, wurb, rrgb, wrww, gugwgbr, ggwr, urgubwr, urr, wubwbgr, wgww, urgu, wuw, grbuw, ubwb, ubug, wru, uuurw, rgwbu, wbbuwr, wurr, ubr, bww, grwwg, u, bgrbg, uwrr, uwuwu, ggurwg, bbu, bbr, rrbgurr, bgbrggwu, rwru, rububwug, bguwwbw, gubw, rg, wwugu, buru, uwru, rrrb, rw, wbb, grgr, bggbwwwg, uwu, rbrgw, ggw, bu, bwrr, gbwuwbr, grw, bgwrw, wuur, uub, uuw, rwugg, ugrgwb, bwrrrgr, rrgrbrgw, grwruug, urw, rb, bg, bwrwwgg, bw, gwwguub, wugb, wwb, wuu, urwg, brwbb, bgbg, rwrrub, wbrwu, guur, gbu, rbbgb, buuubug, gbwruuw, wbwwrub, bru, bbg, brrbbr, rgggb, rbug, wrrrg, ubgu, grrru, buw, uurrg, bur, gbbwwg, ubw, grubrr, wrbgbgwg, ruwwgww, guwrrbu, wbrw, uwb, wrrwwg, wbw, rbbg, gwrr, rwrrwu, wrbrrw, uww, uwg, rbuur, gugwrb, bwgu, rbw, ggrwr, ggb, gbbb, uwwgru, wrgrww, rubwub, urb, rbr, ruw, wgwgw, gbub, rwu, bguub, uw

// uwrbubuwrwgbubguguurwwurbrurbwbwwwgbrwwwg`;

const [towels, patterns] = input
  .split(/(?:\r?\n){2,}/)
  .map((part) => part.split(/(?:,\s)|(?:[\r\n]+)/g)) as [string[], string[]];

const patternsCache = new Map<string, number>();

function addToCache(pattern: string, value: number) {
  patternsCache.set(pattern, value);
  return value;
}

function getPossibleWaysOfDoingPattern(
  pattern: string,
  components: string[]
): number {
  let possibleWays = 0;
  if (patternsCache.has(pattern)) return patternsCache.get(pattern)!;
  if (pattern === "") return addToCache(pattern, 1);
  for (const component of components) {
    if (!pattern.startsWith(component)) continue;
    const possibleWayOfSubPattern = getPossibleWaysOfDoingPattern(
      pattern.substring(component.length),
      components
    );
    if (!possibleWayOfSubPattern) {
      continue;
    }
    possibleWays += possibleWayOfSubPattern;
  }
  return addToCache(pattern, possibleWays);
}

const possiblePatterns = patterns.map((pattern) =>
  getPossibleWaysOfDoingPattern(pattern, towels)
);

const result = sum(...possiblePatterns);
console.log(result);
