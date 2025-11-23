import { readFile } from "node:fs/promises";
import ts from "typescript";
import type { ImportInfo } from "./types.js";

function hasIgnoreComment(node: ts.Node, sourceFile: ts.SourceFile): boolean {
  const nodeStart = node.getFullStart();
  const leading = ts.getLeadingCommentRanges(sourceFile.text, nodeStart);

  if (!leading) return false;

  return leading.some((range) => {
    const commentText = sourceFile.text.slice(range.pos, range.end);
    return commentText.includes("ts-boundaries-ignore");
  });
}

export async function* extractImportsIt(
  filePath: string,
): AsyncIterable<ImportInfo> {
  const content = await readFile(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );

  const stack: ts.Node[] = [sourceFile];

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (
      ts.isImportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      if (!hasIgnoreComment(node, sourceFile)) {
        const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        yield {
          importPath: node.moduleSpecifier.text,
          filePath,
          line: pos.line + 1,
          column: pos.character + 1,
        };
      }
    }

    if (
      ts.isCallExpression(node) &&
      node.expression &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length > 0
    ) {
      const firstArg = node.arguments[0];
      if (firstArg && ts.isStringLiteral(firstArg)) {
        if (!hasIgnoreComment(node, sourceFile)) {
          const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          yield {
            importPath: firstArg.text,
            filePath,
            line: pos.line + 1,
            column: pos.character + 1,
          };
        }
      }
    }

    stack.push(...node.getChildren());
  }
}
