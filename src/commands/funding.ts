import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerFundingCommands(program: Command): void {
  program
    .command("funding-sources <org-id>")
    .description("List funding sources for an organization")
    .option("--limit <n>", "Results per page (default 50)", "50")

    .action(async (orgId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };

        const data = await callApi({
          creds,
          path: `organizations/${orgId}/fundingsources`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("billing-centers <org-id>")
    .description("List billing centers for an organization")
    .option("--limit <n>", "Results per page (default 50)", "50")

    .action(async (orgId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };

        const data = await callApi({
          creds,
          path: `organizations/${orgId}/billingcenters`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
