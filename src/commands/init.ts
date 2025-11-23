import { writeFile } from "node:fs/promises";
import { yellow } from "colorette";
import { join } from "node:path";
import { CONFIG_FILENAME } from "../context.js";
import { generateJSONSchema } from "../schema.js";

export async function initCommand(options: { schema: boolean }) {
  try {
    const cwd = process.cwd();
    const configPath = join(cwd, CONFIG_FILENAME);
    const schemaPath = join(cwd, "fence.schema.json");

    const schema = generateJSONSchema();

    await writeFile(schemaPath, JSON.stringify(schema, null, 2));
    console.log(`[${yellow("INFO")}] Created fence.schema.json`);

    if (!options.schema) {
      const defaultConfig = {
        $schema: "./fence.schema.json",
        rules: [],
      };

      await writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
      console.log(`[${yellow("INFO")}] Created ${CONFIG_FILENAME}`);
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
