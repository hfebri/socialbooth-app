# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "socialbooth-app" built with TypeScript, React 19, and Tailwind CSS. The project uses shadcn/ui components for the UI library and follows the App Router architecture.

## Standard Workflow

Use this workflow when working on a new task:

1. First, think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md
2. The plan should have a list of todo items that you can check off as you complete them.
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information

Periodically make sure to commit when it make sense to do so.

## Development Commands

- `npm run dev` - Start development server with Turbopack (opens on http://localhost:3000)
- `npm run build` - Build the application for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code linting

## Architecture & Structure

### Core Framework

- **Next.js 15** with App Router (`app/` directory)
- **Turbopack** for fast development and builds
- **TypeScript** with strict mode enabled
- **React 19** with RSC (React Server Components)

### UI & Styling

- **Tailwind CSS v4** for styling
- **shadcn/ui** component library (New York style)
- **Lucide React** for icons
- **CSS variables** enabled for theming

### Supabase & Drizzle Integration

- Storage flows currently rely on Supabase buckets accessed server-side; keep service-role usage inside API routes only.
- Database access will be managed with Drizzle ORM. Place schema definitions under `lib/db/` (or another shared folder) and commit generated SQL migrations.
- Required secrets are enumerated in `.env.example` (`SUPABASE_DB_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.); never export service-role keys to the client.

### Prompt Templates

- Each layout defines a `promptTemplate` with `{{variable}}` placeholders and optional defaults; call `buildPrompt` to render the final string.
- API routes derive prompts from the layout id, so prefer sending `promptVariables` overrides instead of raw prompt text.

### File Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
- `lib/` - Utility functions and configurations
- `public/` - Static assets

### Component System

The project uses shadcn/ui with these configurations:

- Style: "new-york"
- Base color: "slate"
- Components path: `@/components`
- Utils path: `@/lib/utils`
- UI components: `@/components/ui`

### Path Aliases

- `@/*` maps to the root directory
- Configured in `tsconfig.json` and `components.json`

## Key Configuration Files

- `components.json` - shadcn/ui configuration
- `eslint.config.mjs` - ESLint with Next.js and TypeScript rules
- `tsconfig.json` - TypeScript configuration with Next.js plugin
- `next.config.ts` - Next.js configuration (minimal setup)

## Dependencies

Key production dependencies:

- `next` (15.5.4)
- `react` & `react-dom` (19.1.0)
- `tailwindcss` (v4)
- `class-variance-authority`, `clsx`, `tailwind-merge` for styling utilities
- `lucide-react` for icons

## Design System & Aesthetics

The application's design is inspired by modern, minimalist photo editing apps, prioritizing a clean, intuitive, and user-friendly interface. The aesthetic is professional and focused, ensuring that the user's photos are the main point of attention.

### Color Palette

The color scheme is clean and neutral, using shades of gray for the interface and a strong blue for interactive elements and accents. This creates a professional look that doesn't interfere with the colors of the user's images.

- **Primary Accent:**
  - `Blue-600` (`#2563EB`): Used for active states, buttons, links, and important icons.
- **Neutral Backgrounds:**
  - `White` (`#FFFFFF`): Primary background for control panels and headers.
  - `Gray-50` (`#F9FAFB`): Background for the main library screen.
  - `Gray-100` (`#F3F4F6`): Background for the editor screen.
  - `Gray-900` (`#11182B`): Outer background for the device frame.
- **Text Colors:**
  - `Gray-800` (`#1F2937`): Used for primary headings and titles.
  - `Gray-700` (`#374151`): Used for labels and standard text.
  - `Gray-600` (`#4B5563`): Used for secondary text and tool names.
  - `Gray-500` (`#6B7281`): Used for inactive tabs and tertiary text.
  - `Gray-400` (`#9CA3AF`): Used for inactive icons.
- **Borders & Dividers:**
  - `Gray-200` (`#E5E7EB`): Used for subtle borders and separators.
- **Overlays:**
  - `White / 80% Opacity`: Used with a `backdrop-blur` effect for toolbars to create a modern, layered feel.
  - `Black / 50% Opacity`: Used for the loading overlay to dim the background and focus the user on the loading state.

### Typography

The application uses the **Inter** font family, which is known for its excellent readability on screens.

- **Font Family**: `'Inter', sans-serif`
- **Weights & Styles**:
  - **Bold** (`font-bold`): Main titles (`My Libary`).
  - **Semibold** (`font-semibold`): Sub-headings, active tabs, and important buttons (`My Album`, `Done`).
  - **Medium** (`font-medium`): Filter names.
  - **Regular** (default): Body text, labels.
- **Sizing**:
  - `text-xl`: Main screen titles.
  - `text-lg`: Control panel titles (`Adjustments`).
  - `text-base`: Tab names.
  - `text-sm`: Slider labels, tool names.
  - `text-xs`: Editor toolbar icon labels.
