import type {
  FenceContext,
  ImportInfo,
  ValidationError,
  FenceRule,
} from "./types.js";
import path from "node:path";
import { matchesAnyPattern } from "./matcher.js";
import { isMatch } from "micromatch";

function joinPathSegments(lhs: string, rhs: string): string {
  if (lhs.endsWith("/") || rhs.startsWith("/")) {
    return lhs + rhs;
  }
  return lhs + "/" + rhs;
}

function* resolveImportPaths(
  importInfo: ImportInfo,
  { config, configRoot }: FenceContext,
) {
  if (importInfo.importPath.startsWith(".")) {
    yield path.resolve(
      path.dirname(importInfo.filePath),
      importInfo.importPath,
    );
  } else {
    for (const [alias, aliasPath] of Object.entries(
      config.resolve?.alias ?? {},
    )) {
      if (importInfo.importPath.startsWith(alias)) {
        yield path.resolve(
          configRoot,
          joinPathSegments(
            aliasPath,
            importInfo.importPath.slice(alias.length),
          ),
        );
      }
    }
  }
}

function isDisallowedImport(
  importPath: string,
  rule: FenceRule,
  { configRoot }: FenceContext,
): boolean {
  if (isMatch(path.relative(configRoot, importPath), rule.disallow)) {
    return true;
  }
  return false;
}

export function* validateImportIt(
  importInfo: ImportInfo,
  context: FenceContext,
): Iterable<ValidationError> {
  for (const rule of context.config.rules) {
    if (!matchesAnyPattern(importInfo.filePath, rule.from, context)) continue;

    for (const importPath of resolveImportPaths(importInfo, context)) {
      if (!isDisallowedImport(importPath, rule, context)) continue;
      yield {
        filePath: importInfo.filePath,
        importPath: importInfo.importPath,
        line: importInfo.line,
        column: importInfo.column,
        message:
          rule.message || `Import from ${importInfo.importPath} is not allowed`,
        rule,
      };
    }
  }
}
