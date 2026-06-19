# 90thSkills Next Sandbox

Clean Next.js target for testing the `90thSkills` Codex plugin.

## Included

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui configuration and common primitives
- Empty `src/features/` target area for generated views

## Setup

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Suggested Test Flow

From the repository root, create a handoff with:

```txt
/planner <legacy screen or workflow>
```

Then build into this sandbox:

```txt
/builder docs/ux/<view-name>-ui-handoff.md -> skill-flow-test/next-sandbox/src/features/<view-name>/
```

Ask `builder` to add a route at:

```txt
skill-flow-test/next-sandbox/src/app/<view-name>/page.tsx
```

Review the result with:

```txt
/reviewer <generated UI screenshot or URL> + docs/ux/<view-name>-ui-handoff.md
```

## Checks

```bash
npm run lint
npm run build
```
