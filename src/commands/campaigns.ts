import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerCampaignCommands(program: Command): void {
  program
    .command("campaigns <account-id>")
    .description("List campaigns for an ad account")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        if (opts.cursor) params.cursor = opts.cursor;
        const data = await callApi({
          creds,
          path: `adaccounts/${accountId}/campaigns`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("campaign <campaign-id>")
    .description("Get a specific campaign")
    .action(async (campaignId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: `campaigns/${campaignId}`,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
