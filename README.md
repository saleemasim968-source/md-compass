# MD Compass

MD Compass is a free, accessible web app for people living with limb-girdle
muscular dystrophy (LGMD) and the people who support them. It brings together a
plain-language Research hub, practical Daily Living guides, an interactive
Timeline of stages of function, and a Community directory. Every medical
statement is sourced and clinically reviewed. It is information, not diagnosis
or personal advice, and it collects no personal data.

## Documents

- [docs/PRD.md](docs/PRD.md): the single source of truth (what we build, for whom, edge cases, constraints)
- [AGENTS.md](AGENTS.md): working rules for humans and AI agents, and which document wins in a conflict
- [docs/CONTENT_GUIDELINES.md](docs/CONTENT_GUIDELINES.md): who writes medical content, sources, templates and review
- [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md): accessibility rules and how they are tested
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): stack, folder layout, database schema, adapters and privacy
- [docs/ROADMAP.md](docs/ROADMAP.md): phases, their gates and current status
- [.claude/skills/build-phase/SKILL.md](.claude/skills/build-phase/SKILL.md): step-by-step process for building one phase

## Commands

- `npm run dev`: start the site at http://localhost:3000
- `npm run check`: typecheck, lint, format check, unit tests and build
- `npm run test:e2e`: browser and accessibility tests
