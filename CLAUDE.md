# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Express.js API server for the ProptiOS property management platform. Runs on port 2024.

## Commands

```bash
npm run dev        # Start server
npm run start      # Same as dev
npm run prod       # Same as dev
```

No test suite currently configured.

## Architecture

```
app/
├── controllers/    # Route handlers
├── middleware/     # Custom Express middleware
├── config/         # Configuration
└── services/       # Business logic

server.js           # HTTP server entry point
app.js              # Express app setup (helmet, CORS, body-parser)
```

## Key Dependencies

- **Database**: mysql2, mariadb
- **Auth**: jsonwebtoken, bcryptjs
- **Queue**: Bull (Redis-backed job queue)
- **Email**: Postmark
- **Payments**: paystack-api, flutterwave-node
- **Real-time**: @xmpp/client
- **Security**: helmet, cors

## Patterns

- JWT-based authentication
- Request validation in controllers
- Service layer for business logic
- Bull queues for async processing

## Deployment

GitHub Actions workflow deploys via SSH to `/var/www/api.pm.proptios.com` on the production server.

## Related Services

- **Frontend**: app.proptios.com (Next.js dashboard)
- **Events API**: api.events.proptios.com (Go)
