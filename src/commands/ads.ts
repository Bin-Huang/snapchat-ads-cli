import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAdCommands(program: Command): void {
  program
    .command("ads <adsquad-id>")
    .description("List ads for an ad squad")
    .option("--limit <n>", "Results per page (default 50)", "50")

    .action(async (adsquadId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };

        const data = await callApi({
          creds,
          path: `adsquads/${adsquadId}/ads`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("ad <ad-id>")
    .description("Get a specific ad")
    .action(async (adId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `ads/${adId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
