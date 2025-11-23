import { yellow } from "colorette";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { CONFIG_FILENAME } from "../context.js";

export async function initCommand() {
  try {
    const cwd = process.cwd();
    const configPath = join(cwd, CONFIG_FILENAME);

    const defaultConfig = {
      $schema:
        "https://raw.githubusercontent.com/maxwihlborg/ts-boundaries-cli/refs/heads/main/schema.json",
      rules: [],
    };

    await writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log(`[${yellow("INFO")}] Created ${CONFIG_FILENAME}`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
