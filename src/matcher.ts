import fg from "fast-glob";
import { isMatch } from "micromatch";
import path from "node:path";
import type { BoundaryContext } from "./types.js";

export function matchesAnyPattern(
  filePath: string,
  patterns: string[],
  context: BoundaryContext,
): boolean {
  return isMatch(path.relative(context.configRoot, filePath), patterns);
}

export async function* findFiles(
  patterns: string | string[],
  context: BoundaryContext,
) {
  yield* fg.globStream(patterns, {
    cwd: context.configRoot,
    absolute: true,
    ignore: ["**/node_modules/**"],
  }) as AsyncIterable<string>;
}
