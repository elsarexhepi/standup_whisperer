# Standup Whisperer

A web app that turns messy workday notes into structured standup updates using OpenAI.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/standup-whisperer run dev` — run the frontend (port 25035)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS
- API: Express 5
- AI: OpenRouter (`google/gemini-2.0-flash-001` via `openai` SDK, JSON mode)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod schemas
- `artifacts/api-server/src/routes/standup/index.ts` — standup generation route
- `artifacts/standup-whisperer/src/pages/StandupPage.tsx` — main page
- `artifacts/standup-whisperer/src/components/standup/` — UI components

## Architecture decisions

- No database needed — standup generation is stateless (notes in, standup out)
- OpenAI JSON mode (`response_format: { type: "json_object" }`) ensures structured output
- The API uses `gpt-4o-mini` for cost-efficiency on this simple task
- Copy for Slack outputs emoji + bold markdown formatting for direct paste into Slack
- Frontend calls `/api/standup/generate` using the artifact's `BASE_URL` prefix (required for Replit proxy routing)

## Product

Users paste messy workday notes and click "Generate Standup". The AI extracts and organizes the content into Yesterday / Today / Blockers. Users can copy the result as plain text or Slack-formatted markdown.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `BASE_URL` from `import.meta.env.BASE_URL` must be used as a prefix for all API calls in the frontend — bare `/api/...` paths bypass the Replit proxy
- After changing `openapi.yaml`, always run `pnpm --filter @workspace/api-spec run codegen` before using new types
- `OPENROUTER_API_KEY` must be set as a Replit Secret — the API server throws at startup if it's missing

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
