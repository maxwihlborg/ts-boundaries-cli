import { cac } from "cac";
import { version } from "../package.json";
import { checkCommand } from "./commands/check.js";
import { initCommand } from "./commands/init.js";

const cli = cac("ts-boundaries");

cli.version(version);
cli.help();

cli
  .command("init")
  .option("--schema", "Output only schema", { default: false })
  .action(initCommand);
cli
  .command("check")
  .option("--vimgrep", "Output in vimgrep format", { default: false })
  .action(checkCommand);

(async function run() {
  try {
    cli.parse(process.argv, { run: false });
    await cli.runMatchedCommand();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  }
})();
