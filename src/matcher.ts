import fg from "fast-glob";
import { isMatch } from "micromatch";
import path from "node:path";
import type { FenceContext } from "./types.js";

export function matchesPattern(
  filePath: string,
  pattern: string,
  context: FenceContext,
): boolean {
  const relativePath = path.relative(context.configRoot, filePath);
  return isMatch(relativePath, pattern);
}

export function matchesAnyPattern(
  filePath: string,
  patterns: string[],
  context: FenceContext,
): boolean {
  return patterns.some((pattern) => matchesPattern(filePath, pattern, context));
}

export async function* findFiles(
  patterns: string | string[],
  context: FenceContext,
) {
  yield* fg.globStream(patterns, {
    cwd: context.configRoot,
    absolute: true,
    ignore: ["**/node_modules/**"],
  }) as AsyncIterable<string>;
}
