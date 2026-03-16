import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export interface Credentials {
  access_token: string;
}

const DEFAULT_PATH = join(
  homedir(),
  ".config",
  "snapchat-ads-cli",
  "credentials.json"
);

export function loadCredentials(path?: string): Credentials {
  if (path) return JSON.parse(readFileSync(path, "utf-8"));

  if (process.env.SNAPCHAT_ADS_ACCESS_TOKEN) {
    return { access_token: process.env.SNAPCHAT_ADS_ACCESS_TOKEN };
  }

  if (existsSync(DEFAULT_PATH)) {
    return JSON.parse(readFileSync(DEFAULT_PATH, "utf-8"));
  }

  throw new Error(
    `No credentials found. Set SNAPCHAT_ADS_ACCESS_TOKEN env var, ` +
    `use --credentials <path>, or place credentials at ${DEFAULT_PATH}`
  );
}
