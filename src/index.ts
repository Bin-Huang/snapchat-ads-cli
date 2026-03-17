#!/usr/bin/env node
import { createRequire } from "node:module";
import { Command } from "commander";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };
import { registerOrganizationCommands } from "./commands/organizations.js";
import { registerAccountCommands } from "./commands/accounts.js";
import { registerFundingCommands } from "./commands/funding.js";
import { registerCampaignCommands } from "./commands/campaigns.js";
import { registerAdSquadCommands } from "./commands/adsquads.js";
import { registerAdCommands } from "./commands/ads.js";
import { registerCreativeCommands } from "./commands/creatives.js";
import { registerAudienceCommands } from "./commands/audiences.js";
import { registerStatsCommands } from "./commands/stats.js";
import { registerMemberCommands } from "./commands/members.js";
import { registerBillingCommands } from "./commands/billing.js";
import { registerTargetingCommands } from "./commands/targeting.js";
import { registerMediaCommands } from "./commands/media.js";
import { registerEstimateCommands } from "./commands/estimates.js";

const program = new Command();

program
  .name("snapchat-ads-cli")
  .description("Snapchat Ads CLI for AI agents")
  .version(version)
  .option("--format <format>", "Output format", "json")
  .option("--credentials <path>", "Path to credentials JSON file")
  .addHelpText(
    "after",
    "\nDocs: https://github.com/Bin-Huang/snapchat-ads-cli"
  );

program.configureOutput({
  writeErr: (str: string) => {
    // Convert commander errors to JSON stderr
    const msg = str.replace(/^error: /i, "").trim();
    if (msg) process.stderr.write(JSON.stringify({ error: msg }) + "\n");
  },
  writeOut: (str: string) => {
    process.stdout.write(str);
  },
});

program.showHelpAfterError(false);

program.hook("preAction", () => {
  const format = program.opts().format;
  if (format !== "json" && format !== "compact") {
    process.stderr.write(
      JSON.stringify({ error: "Format must be 'json' or 'compact'." }) + "\n"
    );
    process.exit(1);
  }
});

registerOrganizationCommands(program);
registerAccountCommands(program);
registerFundingCommands(program);
registerCampaignCommands(program);
registerAdSquadCommands(program);
registerAdCommands(program);
registerCreativeCommands(program);
registerAudienceCommands(program);
registerStatsCommands(program);
registerMemberCommands(program);
registerBillingCommands(program);
registerTargetingCommands(program);
registerMediaCommands(program);
registerEstimateCommands(program);

program.on("command:*", (operands) => {
  process.stderr.write(
    JSON.stringify({ error: `Unknown command: ${operands[0]}. Run --help for available commands.` }) + "\n"
  );
  process.exit(1);
});

if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
