# Standup Whisperer

Turn messy workday notes into structured standup updates using AI.

## What it does

Turns messy notes into structured standup updates:
Yesterday / Today / Blockers
Copy the result as clean text or Slack-formatted markdown optimized for team standups.

## Setup

## How to run
npm install
npm run dev

## Future improvements

- Slack API integration
- Save standup history
- User authentication
- 
### Prerequisites

- Node.js 20+
- pnpm 9+
- An OpenAI API key

### Local development

1. **Clone and install dependencies**

   ```bash
   pnpm install
   ```

2. **Set your OpenRouterAI API key**

   Create a `.env` file or set the environment variable:

   ```bash
   export OPENROUTER_API_KEY=sk-...
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

1. Add `OPENROUTER_API_KEY` to your Replit Secrets (Secrets tab in the sidebar).
2. Click the **Deploy** button in Replit.
3. The app will be live at your `.replit.app` domain.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | Yes | Your OpenRouterAI API key |
| `PORT` | Yes (auto-set) | Port for each service (auto-assigned by Replit) |
| `BASE_PATH` | Yes (auto-set) | URL base path (auto-assigned by Replit) |

## Tech stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express 5 (Node.js)
- **AI**: OpenRouterAI `gpt-4o-mini` via chat completions API
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
## Prompt used

Build a complete React web application called Standup Whisperer. The application should allow users to paste messy notes from their workday and generate a structured standup update. Requirements: Modern responsive web UI Large textarea for input Generate Standup button Output must always contain exactly: Yesterday Today Blockers Use an LLM to structure chaotic notes Loading state while generating Error message if generation fails Empty state before generation Copy to Clipboard button Add a Copy to Slack button with Slack-friendly markdown formatting. Technical requirements: React frontend Clean component structure Environment variable for API key README with setup instructions Ready for deployment on Replit Make the UI professional and easy to use.

## What I tried first

- Initially tried simple regex parsing to extract tasks
- This was too fragile with messy inputs
- Moved to LLM-based structuring for better reliability
- Added strict output formatting rules to ensure consistency

- ## Thoughtful touches

- Loading state while generating standup
- Empty state prompting user to paste notes
- Error handling for failed API calls
- Copy-to-Slack formatting for real-world usage

- 
