import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerTargetingCommands(program: Command): void {
  program
    .command("audience-insights <account-id>")
    .description("Get targeting insights for an ad account (POST)")
    .action(async (accountId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          method: "POST",
          path: `adaccounts/${accountId}/targeting_insights`,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("delivery-status <entity-type> <entity-id>")
    .description("Get delivery status for a campaign, ad squad, or ad (entity-type: campaigns, adsquads, ads)")
    .action(async (entityType: string, entityId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: `${entityType}/${entityId}`,
          params: { fields: "delivery_status" },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("custom-conversions <pixel-id>")
    .description("List custom conversions for a pixel")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .action(async (pixelId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        const data = await callApi({
          creds,
          path: `pixels/${pixelId}/custom_conversions`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("audit-logs <entity-type> <entity-id>")
    .description("List external changelogs for an entity (entity-type: organizations, adaccounts, campaigns, etc.)")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .action(async (entityType: string, entityId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        const data = await callApi({
          creds,
          path: `${entityType}/${entityId}/external_changelogs`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
