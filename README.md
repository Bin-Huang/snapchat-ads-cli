# snapchat-ads-cli

Give AI agents direct access to Snapchat Ads data. One command to query organizations, campaigns, ad squads, and pull performance stats -- no SDK, no docs to read, no tokens wasted on boilerplate.

**Works with:** OpenClaw, Claude Code, Cursor, Codex, and any agent that can run shell commands.

## Installation

```bash
npm install -g snapchat-ads-cli
```

Or run directly with npx:

```bash
npx snapchat-ads-cli --help
```

## How it works

Built on the official [Snapchat Marketing API](https://developers.snap.com/api/marketing-api/Ads-API). Handles OAuth2 Bearer token authentication. Every command outputs structured JSON to stdout, ready for agents to parse without extra processing.

Core endpoints covered:

- **[Organizations](https://developers.snap.com/api/marketing-api/Ads-API/organizations)** -- list and inspect organizations
- **[Ad Accounts](https://developers.snap.com/api/marketing-api/Ads-API/ad-accounts)** -- list and inspect ad accounts
- **[Campaigns](https://developers.snap.com/api/marketing-api/Ads-API/campaigns)** -- list and inspect campaigns
- **[Ad Squads](https://developers.snap.com/api/marketing-api/Ads-API/ad-squads)** -- list and inspect ad squads (Snapchat's term for ad groups)
- **[Ads](https://developers.snap.com/api/marketing-api/Ads-API/ads)** -- list and inspect ads
- **[Creatives](https://developers.snap.com/api/marketing-api/Ads-API/creatives)** -- list and inspect creatives
- **[Audiences](https://developers.snap.com/api/marketing-api/Ads-API/audience-creation)** -- list custom audience segments, Snap Pixels, and custom conversions
- **[Members & Roles](https://developers.snap.com/api/marketing-api/Ads-API/members)** -- organization members and roles
- **[Billing](https://developers.snap.com/api/marketing-api/Ads-API/invoices)** -- invoices and transactions
- **[Measurement](https://developers.snap.com/api/marketing-api/Ads-API/measurement)** -- campaign, ad squad, and ad level stats
- **[Media & Lenses](https://developers.snap.com/api/marketing-api/Ads-API/media)** -- media files and AR lenses
- **[Estimates](https://developers.snap.com/api/marketing-api/Ads-API/bid-estimate)** -- bid estimates, audience size, signal readiness
- **[Audit Logs](https://developers.snap.com/api/marketing-api/Ads-API/audit-logs)** -- organization audit trail

## Setup

### Step 1: Create a Snap app

1. Go to the [Snap Developer Portal](https://developers.snap.com/) and sign in.
2. Create a new app with the Marketing API enabled.
3. Note your **Client ID** and **Client Secret**.

### Step 2: Get an OAuth2 access token

Use the Snap OAuth2 flow to get an access token. See [Snap Authentication docs](https://developers.snap.com/api/marketing-api/Ads-API/authentication).

```bash
# 1. Direct user to authorize (open in browser)
# https://accounts.snapchat.com/login/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=snapchat-marketing-api

# 2. Exchange code for tokens
curl -X POST https://accounts.snapchat.com/login/oauth2/access_token \
  -d "grant_type=authorization_code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=YOUR_AUTH_CODE" \
  -d "redirect_uri=YOUR_REDIRECT_URI"
```

### Step 3: Place the credentials file

```bash
# Option A: Default path (recommended)
mkdir -p ~/.config/snapchat-ads-cli
cat > ~/.config/snapchat-ads-cli/credentials.json << EOF
{
  "access_token": "YOUR_ACCESS_TOKEN"
}
EOF

# Option B: Environment variable
export SNAPCHAT_ADS_ACCESS_TOKEN=your_access_token

# Option C: Pass per command
snapchat-ads-cli --credentials /path/to/credentials.json organizations
```

### Step 4: Find your Organization and Ad Account IDs

```bash
snapchat-ads-cli organizations
snapchat-ads-cli accounts YOUR_ORG_ID
```

## Entity hierarchy

Snapchat Ads uses this hierarchy:

```
Organization
 └── Ad Account
      └── Campaign
           └── Ad Squad (= ad group)
                └── Ad
                     └── Creative
```

Most list commands require the parent entity ID. Start with `organizations` to find your org, then `accounts <org-id>` to find ad accounts, and so on.

## Monetary values

Snapchat uses **micro-currency**: 1 dollar = 1,000,000 micro. All spend values in stats and budgets are in micro-currency. Divide by 1,000,000 to get the actual dollar amount.

## Usage

All commands output pretty-printed JSON by default. Use `--format compact` for compact single-line JSON.

Pagination uses cursor-based `--cursor` values from the `paging.next_link` in the response.

### organizations

List organizations the user has access to.

```bash
snapchat-ads-cli organizations
```

### organization

Get a specific organization.

```bash
snapchat-ads-cli organization org_abc123
```

### accounts

List ad accounts for an organization.

```bash
snapchat-ads-cli accounts org_abc123
snapchat-ads-cli accounts org_abc123 --limit 100
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### account

Get a specific ad account.

```bash
snapchat-ads-cli account acc_abc123
```

### funding-sources

List funding sources for an organization.

```bash
snapchat-ads-cli funding-sources org_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### billing-centers

List billing centers for an organization.

```bash
snapchat-ads-cli billing-centers org_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### campaigns

List campaigns for an ad account.

```bash
snapchat-ads-cli campaigns acc_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### campaign

Get a specific campaign.

```bash
snapchat-ads-cli campaign camp_abc123
```

### adsquads

List ad squads for a campaign.

```bash
snapchat-ads-cli adsquads camp_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### adsquad

Get a specific ad squad.

```bash
snapchat-ads-cli adsquad squad_abc123
```

### ads

List ads for an ad squad.

```bash
snapchat-ads-cli ads squad_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### ad

Get a specific ad.

```bash
snapchat-ads-cli ad ad_abc123
```

### creatives

List creatives for an ad account.

```bash
snapchat-ads-cli creatives acc_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### creative

Get a specific creative.

```bash
snapchat-ads-cli creative cre_abc123
```

### audiences

List custom audience segments for an ad account.

```bash
snapchat-ads-cli audiences acc_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### audience

Get a specific audience segment.

```bash
snapchat-ads-cli audience seg_abc123
```

### pixels

List Snap Pixels for an ad account.

```bash
snapchat-ads-cli pixels acc_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### members

List members of an organization.

```bash
snapchat-ads-cli members org_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### roles

List roles for an organization.

```bash
snapchat-ads-cli roles org_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### invoices

List invoices for an organization.

```bash
snapchat-ads-cli invoices org_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### transactions

List transactions for a billing center.

```bash
snapchat-ads-cli transactions bc_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### audience-insights

Get audience insights for an ad account.

```bash
snapchat-ads-cli audience-insights acc_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### delivery-status

Get delivery status for a campaign, ad squad, or ad. Useful for debugging why an entity is not serving.

```bash
snapchat-ads-cli delivery-status campaigns camp_abc123
snapchat-ads-cli delivery-status adsquads squad_abc123
snapchat-ads-cli delivery-status ads ad_abc123
```

### custom-conversions

List custom conversions for an ad account.

```bash
snapchat-ads-cli custom-conversions acc_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### audit-logs

List audit logs for an organization.

```bash
snapchat-ads-cli audit-logs org_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### media

List media files for an ad account.

```bash
snapchat-ads-cli media acc_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### lenses

List AR lenses for an organization.

```bash
snapchat-ads-cli lenses org_abc123
```

Options:
- `--limit <n>` -- results per page (default 50)
- `--cursor <cursor>` -- pagination cursor

### bid-estimate

Get bid estimate for an ad account.

```bash
snapchat-ads-cli bid-estimate acc_abc123 --optimization-goal IMPRESSIONS
```

Options:
- `--optimization-goal <goal>` -- IMPRESSIONS, SWIPES, APP_INSTALLS, VIDEO_VIEWS, etc.

### audience-size

Get estimated audience size for an ad account.

```bash
snapchat-ads-cli audience-size acc_abc123
```

### signal-readiness

Get signal readiness status for an ad account (measures data quality for optimization).

```bash
snapchat-ads-cli signal-readiness acc_abc123
```

### ad-outcomes

Get ad squad outcome configuration.

```bash
snapchat-ads-cli ad-outcomes squad_abc123
```

### campaign-stats

Get stats for a campaign.

```bash
snapchat-ads-cli campaign-stats camp_abc123 \
  --start-time 2026-03-01T00:00:00.000Z \
  --end-time 2026-03-15T00:00:00.000Z \
  --granularity DAY
```

Options:
- `--start-time <time>` -- start time, ISO 8601 (required)
- `--end-time <time>` -- end time, ISO 8601 (required)
- `--granularity <gran>` -- TOTAL, DAY, HOUR (default TOTAL)
- `--fields <fields>` -- stat fields to include (comma-separated)
- `--swipe-up-attribution-window <window>` -- attribution window for swipe-ups: 1_DAY, 7_DAY, 28_DAY (how long after a swipe-up to count a conversion)
- `--view-attribution-window <window>` -- attribution window for views: 1_HOUR, 3_HOUR, 6_HOUR, 1_DAY, 7_DAY, 28_DAY
- `--conversion-source-types <types>` -- conversion source types (comma-separated): web, app, total

### adsquad-stats

Get stats for an ad squad. Same options as `campaign-stats`.

```bash
snapchat-ads-cli adsquad-stats squad_abc123 \
  --start-time 2026-03-01T00:00:00.000Z \
  --end-time 2026-03-15T00:00:00.000Z
```

### ad-stats

Get stats for an ad. Same options as `campaign-stats`.

```bash
snapchat-ads-cli ad-stats ad_abc123 \
  --start-time 2026-03-01T00:00:00.000Z \
  --end-time 2026-03-15T00:00:00.000Z \
  --granularity HOUR
```

## Error output

Errors are written to stderr as JSON with an `error` field and a non-zero exit code:

```json
{"error": "Unauthorized"}
```

## API Reference

- Ads API Overview: https://developers.snap.com/api/marketing-api/Ads-API
- Authentication: https://developers.snap.com/api/marketing-api/Ads-API/authentication
- Measurement: https://developers.snap.com/api/marketing-api/Ads-API/measurement

## Related

- [google-analytics-cli](https://github.com/Bin-Huang/google-analytics-cli) -- Google Analytics CLI for AI agents
- [google-search-console-cli](https://github.com/Bin-Huang/google-search-console-cli) -- Google Search Console CLI for AI agents
- [tiktok-ads-cli](https://github.com/Bin-Huang/tiktok-ads-cli) -- TikTok Ads CLI for AI agents
- [x-ads-cli](https://github.com/Bin-Huang/x-ads-cli) -- X Ads CLI for AI agents
- [reddit-ads-cli](https://github.com/Bin-Huang/reddit-ads-cli) -- Reddit Ads CLI for AI agents
- [apple-ads-cli](https://github.com/Bin-Huang/apple-ads-cli) -- Apple Ads CLI for AI agents
- [pinterest-ads-cli](https://github.com/Bin-Huang/pinterest-ads-cli) -- Pinterest Ads CLI for AI agents
- [microsoft-ads-cli](https://github.com/Bin-Huang/microsoft-ads-cli) -- Microsoft Advertising CLI for AI agents

## License

Apache-2.0
