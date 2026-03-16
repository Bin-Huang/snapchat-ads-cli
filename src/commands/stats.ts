import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

function addStatsCommand(
  program: Command,
  name: string,
  entityType: string,
  description: string
): void {
  program
    .command(`${name} <entity-id>`)
    .description(description)
    .requiredOption("--start-time <time>", "Start time (ISO 8601, e.g. 2026-03-01T00:00:00.000Z)")
    .requiredOption("--end-time <time>", "End time (ISO 8601)")
    .option("--granularity <gran>", "Granularity: TOTAL, DAY, HOUR (default TOTAL)", "TOTAL")
    .option("--fields <fields>", "Stat fields to include (comma-separated)")
    .option("--conversion-source-types <types>", "Conversion source types (comma-separated)")
    .option("--swipe-up-attribution-window <window>", "Swipe-up attribution: 1_DAY, 7_DAY, 28_DAY")
    .option("--view-attribution-window <window>", "View attribution: 1_HOUR, 3_HOUR, 6_HOUR, 1_DAY, 7_DAY, 28_DAY")
    .action(async (entityId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          granularity: opts.granularity,
          start_time: opts.startTime,
          end_time: opts.endTime,
        };
        if (opts.fields) params.fields = opts.fields;
        if (opts.conversionSourceTypes) params.conversion_source_types = opts.conversionSourceTypes;
        if (opts.swipeUpAttributionWindow) params.swipe_up_attribution_window = opts.swipeUpAttributionWindow;
        if (opts.viewAttributionWindow) params.view_attribution_window = opts.viewAttributionWindow;
        const data = await callApi({
          creds,
          path: `${entityType}/${entityId}/stats`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}

export function registerStatsCommands(program: Command): void {
  addStatsCommand(program, "campaign-stats", "campaigns", "Get stats for a campaign");
  addStatsCommand(program, "adsquad-stats", "adsquads", "Get stats for an ad squad");
  addStatsCommand(program, "ad-stats", "ads", "Get stats for an ad");
}
