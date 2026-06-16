## Project

Teasenotes — AI-powered personal notes app. Each user has a private Supabase (PostgreSQL) database. Claude talks to it via the **official Supabase hosted MCP** (`https://mcp.supabase.com/mcp`). No custom backend.

## Repo layout

- `onboarding/` — React 18 + Chakra UI **v2** + Vite 5 setup wizard (4 steps)
  - `src/pages/` — StepSupabase, StepWorker (MCP connect step), StepClaude, StepTest
  - `src/components/` — Layout (nav + progress bar), CodeBlock (with copy button)
- Root `package.json` — thin wrapper; `npm run dev/build/preview` delegates to `onboarding/`

## System prompt (Claude Project Instructions)

The system prompt lives in `onboarding/src/pages/StepClaude.tsx` as the `SYSTEM_PROMPT` constant. This is the single source of truth — it is what the onboarding wizard displays to users to copy into their Claude Project. To update the instructions Claude gives end-users, edit that constant directly. There is no separate markdown file; `prompts/system-prompt.md` has been deleted.

## Stack constraints

- **Chakra UI v2** — use `AlertIcon`, `OrderedList/ListItem`, `isReadOnly`, `isExternal`, `colorScheme`. NOT v3 API (`defaultSystem`, `createSystem`, etc.)
- **React Router v6** — `useNavigate`, `<Routes>/<Route>/<Navigate replace>`
- **TypeScript strict** with `noUnusedLocals: true` — always remove unused imports before committing
- Build artifacts (`dist/`, `tsconfig.tsbuildinfo`) are gitignored; do not commit them

## System prompt tool names

The Claude system prompt references Supabase MCP tools by their actual names:
`list_tables`, `execute_sql(query)`, `apply_migration(name, query)`

Standard columns every table must include: `id UUID DEFAULT gen_random_uuid() PRIMARY KEY`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

## Dev workflow

```powershell
# New terminal always needs:
$env:PATH = "C:\Program Files\nodejs;C:\Program Files\GitHub CLI;" + $env:PATH

cd onboarding
npx tsc --noEmit   # type-check
npm run build      # production build (Vite)
```

After changes: `git add . ; git commit -m "..." ; git push` — Vercel auto-deploys from main.

## Deployment

- Vercel project root: `onboarding/` — auto-deploys on push to main
- GitHub: https://github.com/SteveMilesQuant/teasenotes
