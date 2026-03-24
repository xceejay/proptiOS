# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Go API server for event handling in the ProptiOS platform.

## Commands

```bash
make build         # Build binary (outputs api.out)
make run           # Build and run
make build-windows # Cross-compile for Windows
```

## Architecture

```
cmd/api-server/     # Main binary entry point
api/                # HTTP route handlers
config/             # Configuration
db/                 # Database setup and migrations
internal/           # Internal packages (not importable)
pkg/                # Public/shared packages
metrics/            # Monitoring and metrics
scripts/            # Utility scripts
deployments/        # Deployment configurations
```

## Key Dependencies

- **Router**: github.com/go-chi/chi/v5
- **Database**: github.com/lib/pq (PostgreSQL), go-ozzo/ozzo-dbx
- **Auth**: golang-jwt/jwt/v5
- **Validation**: go-ozzo/ozzo-validation/v4
- **Streaming**: segmentio/kafka-go
- **Logging**: uber-go/zap, sirupsen/logrus
- **Testing**: stretchr/testify

## Patterns

- Chi router with middleware chain
- ozzo-validation for request validation
- Structured logging with zap
- Internal packages for encapsulation

## Environment

Requires `.env` file (loaded via Makefile). Go version 1.15.

## Related Services

- **Frontend**: app.proptios.com (Next.js dashboard)
- **Main API**: api.pm.proptios.com (Express)
