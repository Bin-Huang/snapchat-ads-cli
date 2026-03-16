import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAdSquadCommands(program: Command): void {
  program
    .command("adsquads <campaign-id>")
    .description("List ad squads for a campaign")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (campaignId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        if (opts.cursor) params.cursor = opts.cursor;
        const data = await callApi({
          creds,
          path: `campaigns/${campaignId}/adsquads`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("adsquad <adsquad-id>")
    .description("Get a specific ad squad")
    .action(async (adsquadId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: `adsquads/${adsquadId}`,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
