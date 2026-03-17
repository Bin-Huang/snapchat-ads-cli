import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAudienceCommands(program: Command): void {
  program
    .command("audiences <account-id>")
    .description("List custom audiences for an ad account")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
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
    .command("pixel <account-id>")
    .description("Get the Snap Pixel for an ad account")
    .action(async (accountId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: `adaccounts/${accountId}/pixels`,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
