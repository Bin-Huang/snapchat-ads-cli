import type { Credentials } from "./auth.js";

const BASE_URL = "https://adsapi.snapchat.com/v1";

interface CallOptions {
  creds: Credentials;
  path: string;
  params?: Record<string, string>;
  method?: "GET" | "POST";
  body?: unknown;
}

export async function callApi(opts: CallOptions): Promise<unknown> {
  const method = opts.method ?? "GET";
  const url = new URL(`${BASE_URL}/${opts.path}`);
  if (opts.params) {
    for (const [k, v] of Object.entries(opts.params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${opts.creds.access_token}`,
  };
  let reqBody: string | undefined;
  if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    reqBody = JSON.stringify(opts.body);
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: reqBody,
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { rawResponse: text };
  }

  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "request_status" in data
        ? String((data as Record<string, unknown>).request_status)
        : `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
