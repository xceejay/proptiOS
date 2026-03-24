# ProptiOS  (API)

Official proptios.com API for property manager dashboard

This service is maintained from the `proptiOS` monorepo.

Contribution policy:
- clone and work from the root monorepo
- do not open feature branches or PRs from this child repository
- changes made here directly do not sync back to the monorepo automatically

Sync test marker: propagated from monorepo on 2026-03-24.

## Local Dev Setup

1. Start MariaDB: `sudo systemctl start mariadb`
2. Import DB: `mariadb -u root proptios_db < dump.sql`
3. Create `.env` (see `.env.example`)
4. Use Node 20 (`nvm use 20`)
5. `pnpm dev` — runs on port 2024
6. Root shortcuts: `pnpm doctor`, `pnpm bootstrap`, `pnpm dev:api-pm`

### .env required vars
```
PORT=2024
PMAPI_MYSQL_HOST=localhost
PMAPI_MYSQL_USER=proptios
PMAPI_MYSQL_PASS=<password>
PMAPI_MYSQL_DB=proptios_db
JWT_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
```
