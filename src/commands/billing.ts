import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerBillingCommands(program: Command): void {
  program
    .command("invoices <org-id>")
    .description("List invoices for an organization")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (orgId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        if (opts.cursor) params.cursor = opts.cursor;
        const data = await callApi({
          creds,
          path: `organizations/${orgId}/invoices`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("transactions <billing-center-id>")
    .description("List transactions for a billing center")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (billingCenterId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        if (opts.cursor) params.cursor = opts.cursor;
        const data = await callApi({
          creds,
          path: `billingcenters/${billingCenterId}/transactions`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
