import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerOrganizationCommands(program: Command): void {
  program
    .command("organizations")
    .description("List organizations the user has access to")
    .action(async () => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: "me/organizations" });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("organization <org-id>")
    .description("Get a specific organization")
    .action(async (orgId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `organizations/${orgId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
