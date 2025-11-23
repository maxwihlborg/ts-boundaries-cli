import type { z } from "zod";
import type { FenceConfigSchema, FenceRuleSchema } from "./schema.js";

export type FenceRule = z.output<typeof FenceRuleSchema>;
export type FenceConfig = z.output<typeof FenceConfigSchema>;
export type ImportInfo = {
  importPath: string;
  filePath: string;
  line: number;
  column: number;
};

export type ValidationError = {
  filePath: string;
  importPath: string;
  line: number;
  column: number;
  message: string;
  rule: FenceRule;
};

export type FenceContext = {
  configRoot: string;
  config: FenceConfig;
};
