import type {
  BoundaryContext,
  ImportInfo,
  ValidationError,
  BoundaryRule,
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
  { config, configRoot }: BoundaryContext,
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
  rule: BoundaryRule,
  { configRoot }: BoundaryContext,
): boolean {
  if (isMatch(path.relative(configRoot, importPath), rule.disallow)) {
    return true;
  }
  return false;
}

export function* validateImportIt(
  importInfo: ImportInfo,
  context: BoundaryContext,
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
