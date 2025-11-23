#!/usr/bin/env pnpm -S tsx

import fs from "node:fs/promises";
import { generateJSONSchema } from "../src/schema.js";

await fs.writeFile(
  new URL("../schema.json", import.meta.url),
  JSON.stringify(generateJSONSchema(), null, 2),
);

console.log("Updated schema.json");
