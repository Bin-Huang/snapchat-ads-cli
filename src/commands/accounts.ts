import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAccountCommands(program: Command): void {
  program
    .command("accounts <org-id>")
    .description("List ad accounts for an organization")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (orgId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        if (opts.cursor) params.cursor = opts.cursor;
        const data = await callApi({
          creds,
          path: `organizations/${orgId}/adaccounts`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("account <account-id>")
    .description("Get a specific ad account")
    .action(async (accountId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: `adaccounts/${accountId}`,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
