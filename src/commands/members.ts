import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerMemberCommands(program: Command): void {
  program
    .command("members <org-id>")
    .description("List members of an organization")
    .option("--limit <n>", "Results per page (default 50)", "50")

    .action(async (orgId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };

        const data = await callApi({
          creds,
          path: `organizations/${orgId}/members`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("roles <org-id>")
    .description("List roles for an organization")
    .option("--limit <n>", "Results per page (default 50)", "50")

    .action(async (orgId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };

        const data = await callApi({
          creds,
          path: `organizations/${orgId}/roles`,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
