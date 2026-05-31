# Standup Whisperer

Turn messy workday notes into structured standup updates using AI.

## What it does

Paste anything — bullet points, stream of consciousness, Slack messages — and Standup Whisperer will organize it into a clean standup with **Yesterday**, **Today**, and **Blockers** sections. Copy the result as plain text or as Slack-formatted markdown with one click.

## Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- An OpenAI API key

### Local development

1. **Clone and install dependencies**

   ```bash
   pnpm install
   ```

2. **Set your OpenAI API key**

   Create a `.env` file or set the environment variable:

   ```bash
   export OPENAI_API_KEY=sk-...
   ```

   On Replit, add it via the Secrets tab.

3. **Start the API server**

   ```bash
   pnpm --filter @workspace/api-server run dev
   ```

4. **Start the frontend** (in a separate terminal)

   ```bash
   PORT=3000 BASE_PATH=/ pnpm --filter @workspace/standup-whisperer run dev
   ```

5. Open `http://localhost:3000` in your browser.

## Deployment on Replit

1. Add `OPENAI_API_KEY` to your Replit Secrets (Secrets tab in the sidebar).
2. Click the **Deploy** button in Replit.
3. The app will be live at your `.replit.app` domain.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `PORT` | Yes (auto-set) | Port for each service (auto-assigned by Replit) |
| `BASE_PATH` | Yes (auto-set) | URL base path (auto-assigned by Replit) |

## Tech stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express 5 (Node.js)
- **AI**: OpenAI `gpt-4o-mini` via chat completions API
- **Monorepo**: pnpm workspaces

## Project structure

```
artifacts/
  api-server/          — Express API (POST /api/standup/generate)
  standup-whisperer/   — React frontend
lib/
  api-spec/            — OpenAPI spec (source of truth)
  api-client-react/    — Generated React Query hooks
  api-zod/             — Generated Zod validation schemas
```

## API

### `POST /api/standup/generate`

**Request body:**
```json
{ "notes": "your messy notes here" }
```

**Response:**
```json
{
  "yesterday": "- Fixed the JWT token expiry bug\n- Synced with design team",
  "today": "- Review PR #342\n- Start user settings page",
  "blockers": "- Waiting on backend API for notification feature"
}
```
