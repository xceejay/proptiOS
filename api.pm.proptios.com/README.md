# ProptiOS  (API)

Official proptios.com API for property manager dashboard

This service is maintained from the `proptiOS` monorepo. Preferred local workflow: clone the root repo and run commands from there.

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
