# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Property manager dashboard built with Next.js 15, React 19, and Material-UI 7.

## Commands

```bash
pnpm dev           # Start development server
pnpm build         # Production build
pnpm start         # Start production server (Turbopack)
pnpm lint          # ESLint with auto-fix
pnpm format        # Prettier formatting
pnpm build:icons   # Bundle Iconify icons
```

## Architecture

```
src/
├── @core/          # Core utilities and hooks
├── @fake-db/       # Mock database for demo/testing
├── api/            # API integration layer (Axios)
├── configs/        # App configuration
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── layouts/        # Page layout components
├── lib/            # Utilities (auth0, etc.)
├── mui/            # Material-UI theme customizations
├── navigation/     # Navigation and menu configs
├── pages/          # Next.js pages (file-based routing)
├── store/          # Redux state management
└── views/          # Reusable view components
```

## Key Patterns

- **Authentication**: Auth0 via `@auth0/nextjs-auth0` - middleware in `middleware.js` protects all routes
- **Authorization**: CASL (`@casl/ability`, `@casl/react`) for role-based access control
- **State Management**: Redux Toolkit in `src/store/`
- **Forms**: React Hook Form + Yup validation
- **Rich Text Editor**: TipTap with MUI integration (mui-tiptap)
- **Data Grid**: MUI X Data Grid for tables
- **Path Aliases**: Configured in `jsconfig.json` (e.g., `@core/`, `@layouts/`, `@views/`)

## Code Style

- ESLint v9 flat config (`eslint.config.mjs`)
- Prettier: 120 char width, 2 spaces, single quotes, no semicolons
- React 19 with JSX (no TypeScript)

## Environment Variables

Required in `.env`:
```
AUTH0_SECRET=
AUTH0_DOMAIN=manageshomes.eu.auth0.com
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
NEXT_PUBLIC_API_BASE_URL=https://api.pm.proptios.com
NEXT_PUBLIC_JWT_SECRET=
NEXT_PUBLIC_JWT_EXPIRATION=5m
```

## Related Services

- **API**: api.pm.proptios.com (Express) - main backend
- **Events API**: api.events.proptios.com (Go)
