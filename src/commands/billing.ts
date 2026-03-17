import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerBillingCommands(program: Command): void {
  program
    .command("invoices <account-id>")
    .description("List invoices for an ad account")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        const data = await callApi({
          creds,
          path: `adaccounts/${accountId}/invoices`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("transactions <org-id>")
    .description("List transactions for an organization")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .action(async (orgId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        const data = await callApi({
          creds,
          path: `organizations/${orgId}/transactions`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
