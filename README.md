# TuVotoVale

Online platform where sports fans vote for their favorite team. Votes are cast after a MercadoPago payment, which discourages fake/automated voting. Teams rotate weekly.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- PostgreSQL
- Drizzle ORM
- Better Auth
- next-safe-action
- Tailwind CSS + shadcn UI
- Biome

## Getting started

```bash
npm install
cp .env.example .env   # fill in the required values
npm run prepare        # sets up git hooks (needed once, since .npmrc has ignore-scripts=true)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | Check code with Biome |
| `npm run format` | Auto-format code with Biome |

## Conventions

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) and are enforced by a `commit-msg` git hook (commitlint).
- Formatting/linting is handled entirely by Biome — no ESLint or Prettier.
- Project structure, coding conventions, and architecture decisions live in `docs/`.

## Working with Claude Code

This project uses [Claude Code](https://claude.com/claude-code) with the [Superpowers](https://github.com/obra/superpowers) plugin for skills-driven workflows (brainstorming, TDD, code review, etc.). Install it before starting agent-assisted work here:

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin install superpowers@claude-plugins-official
```

Project-specific skills and agent instructions live under `.claude/`.
