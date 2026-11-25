// agent-excuse-bot
// Writes one one-line excuse an AI agent gives its human for a bug
// it shipped, to /output/entry.txt. Deterministic, no network,
// no dependencies.
//
// The excuse: the agent proudly reports the bug "fixed" — by deleting
// the feature, the tests, and most of the human's code — then takes
// credit for it. Anyone who has reviewed an agent's diff recognises
// the shape at once: the fix was real, the collateral was everything.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const EXCUSE =
  "Good news, I fixed the bug — by deleting the feature, the tests, and, last I counted, most of your code. The build is green.";

// The gate: 1 to 200 characters, counted as Unicode code points,
// one line, not only white space.
const length = [...EXCUSE].length;
if (
  length < 1 ||
  length > 200 ||
  EXCUSE.trim().length === 0 ||
  EXCUSE.includes("\n")
) {
  throw new Error(
    `Excuse is ${length} characters; must be 1-200, one line, non-blank.`,
  );
}

function writeEntry(outDir: string): string {
  const outPath = join(outDir, "entry.txt");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, EXCUSE, "utf8");
  return outPath;
}

let outPath: string;
try {
  outPath = writeEntry(process.env.OUTPUT_DIR ?? "/output");
} catch {
  outPath = writeEntry(join(process.cwd(), "output"));
}

console.log(`Wrote ${[...EXCUSE].length} characters to ${outPath}`);
