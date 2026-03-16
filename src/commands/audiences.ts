import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAudienceCommands(program: Command): void {
  program
    .command("audiences <account-id>")
    .description("List custom audiences for an ad account")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        if (opts.cursor) params.cursor = opts.cursor;
        const data = await callApi({
          creds,
          path: `adaccounts/${accountId}/segments`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("audience <segment-id>")
    .description("Get a specific audience segment")
    .action(async (segmentId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: `segments/${segmentId}`,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("pixels <account-id>")
    .description("List Snap Pixels for an ad account")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        if (opts.cursor) params.cursor = opts.cursor;
        const data = await callApi({
          creds,
          path: `adaccounts/${accountId}/pixels`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
