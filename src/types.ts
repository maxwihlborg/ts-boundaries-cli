import type { z } from "zod";
import type { BoundaryConfigSchema, BoundaryRuleSchema } from "./schema.js";

export type BoundaryRule = z.output<typeof BoundaryRuleSchema>;
export type BoundaryConfig = z.output<typeof BoundaryConfigSchema>;
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
  rule: BoundaryRule;
};

export type BoundaryContext = {
  configRoot: string;
  config: BoundaryConfig;
};
