import { z } from "zod";

export const BoundaryRuleSchema = z
  .object({
    from: z.array(z.string()).meta({
      description:
        "Glob patterns matching source files that this rule applies to",
    }),
    disallow: z.array(z.string()).meta({
      description:
        "Glob patterns matching import paths that should be disallowed",
    }),
    message: z.string().optional().meta({
      description: "Custom error message to display when this rule is violated",
    }),
  })
  .meta({
    description:
      "A boundary rule that prevents specific imports from specific locations",
  });

export const BoundaryConfigSchema = z
  .object({
    $schema: z.string().optional().meta({
      description: "JSON Schema reference for IDE support",
    }),
    rules: z.array(BoundaryRuleSchema).meta({
      description: "List of boundary rules to enforce architectural boundaries",
    }),
    resolve: z
      .object({
        alias: z.record(z.string(), z.string()).optional().meta({
          description:
            "Path aliases for import resolution (e.g., '~': './src')",
        }),
      })
      .optional()
      .meta({
        description: "Import resolution configuration",
      }),
  })
  .meta({
    description: "Configuration for TypeScript boundaries enforcement",
  });

export function generateJSONSchema() {
  return z.toJSONSchema(BoundaryConfigSchema);
}
