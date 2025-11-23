import { z } from "zod";

export const FenceRuleSchema = z.object({
  from: z.array(z.string()),
  disallow: z.array(z.string()),
  message: z.string().optional(),
});

export const FenceConfigSchema = z.object({
  $schema: z.string().optional(),
  rules: z.array(FenceRuleSchema),
  resolve: z.object({
    alias: z.record(z.string(), z.string()).optional(),
  }).optional(),
});

export const ImportInfoSchema = z.object({
  importPath: z.string(),
  filePath: z.string(),
  line: z.number(),
  column: z.number(),
});

export const ValidationErrorSchema = z.object({
  filePath: z.string(),
  importPath: z.string(),
  line: z.number(),
  column: z.number(),
  message: z.string(),
  rule: FenceRuleSchema,
});

export const FenceContextSchema = z.object({
  configRoot: z.string(),
  config: FenceConfigSchema,
});

export type FenceRule = z.output<typeof FenceRuleSchema>;
export type FenceConfig = z.output<typeof FenceConfigSchema>;
export type ImportInfo = z.output<typeof ImportInfoSchema>;
export type ValidationError = z.output<typeof ValidationErrorSchema>;
export type FenceContext = z.output<typeof FenceContextSchema>;

export function generateJSONSchema() {
  return z.toJSONSchema(FenceConfigSchema);
}
