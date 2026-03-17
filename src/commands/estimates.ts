import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerEstimateCommands(program: Command): void {
  program
    .command("bid-estimate <account-id>")
    .description("Get bid estimate for targeting specs")
    .option("--optimization-goal <goal>", "Optimization goal: IMPRESSIONS, SWIPES, APP_INSTALLS, VIDEO_VIEWS, etc.")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {};
        if (opts.optimizationGoal) params.optimization_goal = opts.optimizationGoal;
        const data = await callApi({
          creds,
          path: `adaccounts/${accountId}/bid_estimate`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("audience-size <account-id>")
    .description("Get estimated audience size for targeting specs")
    .action(async (accountId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: `adaccounts/${accountId}/audience_size`,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("signal-readiness <pixel-id>")
    .description("Get event quality scores for a pixel")
    .action(async (pixelId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: `pixels/${pixelId}/event_quality_scores`,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("ad-outcomes <adsquad-id>")
    .description("Get ad squad outcome configuration")
    .action(async (adsquadId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: `adsquads/${adsquadId}/outcomes`,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
