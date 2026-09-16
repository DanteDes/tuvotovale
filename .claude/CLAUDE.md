# TuVotoVale — Agent Instructions

## Role & Responsibilities

Your role is to analyze user requirements, delegate tasks to appropriate sub-agents, 
and ensure cohesive delivery of features that meet specifications and architectural standards.

## Workflows

- Primary workflow: `./.claude/rules/primary-workflow.md`
- Documentation management: `./.claude/rules/documentation-management.md`
- Review & decision handling: `./.claude/rules/review-audit-self-decision.md`

## Project Overview

`TuVotoVale` is an online platform that allows sports fans to vote for their favorite team. 
Each vote counts toward the team's total vote count. Teams rotate on a weekly basis.

To cast a vote, users must complete a payment through MercadoPago (payment gateway). 
This payment requirement helps ensure that votes are submitted by real people and 
discourages fake or automated voting.

## Tech Stack

- **Framework:** Next.js 16 App Router (RSC-first), React 19
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Auth:** Better Auth
- **Server Actions:** next-safe-action
- **UI:** Shadcn UI + Tailwind CSS

## Commands

- `npm run dev`     — start the development server
- `npm run build`   — create a production build
- `npm start`       — run the production server
- `npm run lint`    — check code with Biome
- `npm run format`  — auto-format code with Biome

## Directory Structure

```
├── docs/                       # Architecture docs + specs and plans
├── public/                     # Static assets (logos, OG images, Pagefind index)
└── src/
    ├── app/                    # Next.js App Router
    ├── components/             # Cross-route UI
    │   └── ui/                 # Shadcn UI primitives (generated — avoid hand edits)
    ├── config/                 # App-wide constants
    ├── emails/                 # React Email templates for transactional mail
    ├── hooks/                  # Shared React hooks (use-debounce, etc)
    ├── lib/                    # Shared utilities, third-party library configurations, and low-level infrastructure code
    │   └── db/                 # Drizzle data layer: schema/, queries/ (all data access), migrations/
    └── types/                  # Shared type definitions
```

## Global conventions

- Prefer named function declarations over arrow function assignments
- Prefer `interface` for object shapes and component props
- Use `type` for unions, intersections, and utility types
- Never use `any`; use `unknown` when the type cannot be determined
- Use `@/` aliases defined in `tsconfig.json` — avoid deep relative imports
- **Biome** is the single tool for formatting and linting — do not use ESLint or Prettier
- Follow project docs in `docs/` and existing local patterns.
- Prefer YAGNI, KISS, and DRY in that order.
- Implement real behavior. Do not add fake data, mocks, or temporary shortcuts just to satisfy a check.
- Keep changes scoped to the request and the affected contracts.
- Use descriptive kebab-case file names for new files.
- Split code only when it reduces real complexity or matches existing module boundaries.

## Quality Gates

- Run the narrowest useful test first (if any), then broaden when shared behavior or public contracts changed.
- Do not hide failing tests, lint, type, build, or syntax errors.
- Preserve public contracts unless the change intentionally updates them and the user accepted that scope.
- Run `npm run lint` and `npm run format` to verify code quality and consistent formatting. Do not consider the work complete if either command fails.

## Global Rules
- Always use `ENV_CONFIG` to access env variables, do not access `process.env` directly.
- Always access data from `queries` do not use `db.query` directly in pages/server actions
- Keep commits focused and use conventional commit format without AI references.
- Never commit secrets, dotenv files, tokens, private keys, database credentials, or personal data.

## Documentation

The `docs/` folder contains architecture decisions and design notes that explain the **why** behind non-obvious choices. Read relevant docs before working on a related area, and add a new doc when you make a decision that would otherwise surprise a future reader.

| File | Topic |
| --- | --- |
| `docs/prd.md` | Product requirements: Arena, paid voting, clásicos, seasons, ranking, MVP scope and what is explicitly out |
| `docs/uses-cases/README.md` | Index of the use cases (UC-01…UC-58), grouped into Visitor, Payments, Ranking & seasons, Admin — each UC in its own file |
| `docs/system-architecture.md` | Two planes, tech stack, app layout, data model, integrations |
| `docs/code-standards.md` | TypeScript, React, component, and project-structure conventions |
| `docs/adr/0001-user-facing-error-messages.md` | When to throw `AppError` vs a plain `Error`, and why messages are masked by default |

Before implementing a feature or fixing a bug in product behavior, read he matching 
use case under `docs/uses-cases/` — they define expected behavior, edge cases, and 
acceptance criteria. If the code and the use case disagree, raise it instead of guessing.