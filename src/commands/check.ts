import { green, red } from "colorette";
import { asyncFilter, asyncFlatMap, execPipe } from "iter-tools-es";
import { loadFenceContext } from "../context.js";
import { findFiles } from "../matcher.js";
import path from "node:path";
import { extractImportsIt } from "../parser.js";
import { validateImportIt } from "../validator.js";

export async function checkCommand(options: { vimgrep: boolean }) {
  const cwd = process.cwd();
  const context = await loadFenceContext(cwd);

  let errorCount = 0;

  const patterns = context.config.rules.flatMap((rule) => rule.from);
  const exts = new Set([".ts", ".tsx"]);

  for await (const error of execPipe(
    findFiles(patterns, context),
    asyncFilter((file) => exts.has(path.extname(file))),
    asyncFlatMap((file) => extractImportsIt(file)),
    asyncFlatMap((importInfo) => validateImportIt(importInfo, context)),
  )) {
    errorCount += 1;

    if (options.vimgrep) {
      console.log(
        `${error.filePath}:${error.line}:${error.column}: ${error.message}`,
      );
    } else {
      console.log(
        `${path.relative(cwd, error.filePath)}:${error.line}:${error.column}`,
      );
      console.log(`  ${error.message}`);
      console.log(`  Import: ${error.importPath}\n`);
    }
  }

  if (errorCount <= 0) {
    if (!options.vimgrep) {
      console.log(`[${green("SUCCESS")}] No fence violations found`);
    }
    process.exit(0);
  } else {
    if (!options.vimgrep) {
      console.log(`[${red("ERROR")}] Found ${errorCount} fence violation(s)`);
    }
    process.exit(1);
  }
}
