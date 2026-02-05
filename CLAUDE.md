# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

jandi-karao is a terminal-based chat UI application built with React and @opentui/react. It renders React components directly in the terminal (not a web browser).

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Run with hot reload (watches src/index.tsx)
bun src/index.tsx    # Run the application directly
```

## Architecture

- **src/index.tsx** - Main application entry point. Contains the `App` component with two views:
  - Home page: ASCII banner with search input
  - Chat view: Header, scrollable message area, and input footer
- **src/lib/output-screenshot.ts** - macOS-specific utility for capturing terminal output as PNG (uses AppleScript)

The app uses @opentui/core for CLI rendering and @opentui/react for React bindings. Key primitives: `<box>`, `<text>`, `<input>`, `<scrollbox>`.

Exit with `/exit` or `/quit` commands.

## Bun-First Development

Always use Bun instead of Node.js, npm, or Vite:

- `bun <file>` instead of `node <file>`
- `bun test` instead of jest/vitest
- `bun install` instead of npm/yarn/pnpm install
- Bun auto-loads .env files (no dotenv needed)
- Prefer Bun APIs: `Bun.file` over fs, `Bun.serve()` over express, `bun:sqlite` over better-sqlite3

## Code Quality Habits

**After writing code, always run:**
```bash
bun typecheck        # Check for TypeScript errors
```

**Reference skills for guidance:**
- Always check `.claude/skills/` directory for domain-specific knowledge
- `opentui/` - OpenTUI component patterns and best practices
- `typescript-expert.md` - TypeScript patterns and conventions
- `ai-sdk.md` - AI SDK integration patterns

## Git Commit Conventions

Follow conventional commit format with these guidelines:

- **Format:** `<type>: <description>` (all lowercase)
- **Types:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`
- **Style:** concise messages, lowercase, no emojis
- **Do not** add "Co-Authored-By: Claude" footer

**Examples:**
```
feat: add ai sdk dependencies
fix: remove trailing comma in tsconfig
chore: update dependencies
```

## Import and File Naming Conventions

- **Use "@" alias for imports**: Always use `@/` alias instead of relative imports (`../` or `../../`)
  - Example: `import { theme } from "@/lib/theme"` instead of `import { theme } from "../lib/theme"`
- **File naming**: Use kebab-case for all filenames (e.g., `chat-page.tsx`, `command-menu.tsx`, `use-command-menu.ts`)
  - Component files: `chat-page.tsx`, `home-page.tsx`
  - Hook files: `use-command-menu.ts`
  - Utility files: `output-screenshot.ts`
