import * as find from "empathic/find";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { FenceConfigSchema } from "./schema.js";
import type { FenceContext } from "./types.js";

export const CONFIG_FILENAME = "fence.config.json";

export async function loadFenceContext(cwd: string): Promise<FenceContext> {
  const configPath = find.up(CONFIG_FILENAME, { cwd: cwd });

  if (!configPath) {
    throw new Error(`No ${CONFIG_FILENAME} file found`);
  }

  try {
    const content = await readFile(configPath, "utf-8");
    const parsedContent = JSON.parse(content);
    return {
      configRoot: path.dirname(configPath),
      config: FenceConfigSchema.parse(parsedContent),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(z.prettifyError(error));
      throw new Error("Validation error");
    }
    throw new Error(`Failed to parse config file ${configPath}: ${error}`);
  }
}
