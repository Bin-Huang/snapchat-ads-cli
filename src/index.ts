#!/usr/bin/env node
import { Command } from "commander";
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
  .version("1.0.0")
  .option("--format <format>", "Output format", "json")
  .option("--credentials <path>", "Path to credentials JSON file")
  .addHelpText(
    "after",
    "\nDocs: https://github.com/Bin-Huang/snapchat-ads-cli"
  );

program.configureOutput({
  writeErr: () => {},
});

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

if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
