# General Code Review (2026-03-29)

## Scope
- Reviewed core API/auth/payment paths in `api.events.proptios.com`.
- Ran baseline tests to identify immediate reliability issues.

## Findings

### 1) High: Constructor panic can crash the process
**File:** `internal/payments/service.go`

`NewService` panics when `producer == nil`. Constructors in request-serving systems should generally return an error instead of panicking, so startup/config mistakes do not terminate the process unexpectedly without graceful handling.

**Impact:** Service-wide crash risk and harder operational recovery.

**Recommendation:**
- Change signature to `NewService(repo Repository, producer *KafkaProducer) (*Service, error)`.
- Return a wrapped error when producer is missing.
- Handle this error in composition/bootstrap code.

---

### 2) High: JWT middleware accepts missing identity claims
**File:** `internal/auth/middleware.go`

After token validation, the middleware extracts claims with:
- `userID, _ := claims["id"].(string)`
- `userName, _ := claims["name"].(string)`

If claims are absent or wrong type, empty strings are accepted and written into context as authenticated user data.

**Impact:** Authorization ambiguity; downstream handlers may treat malformed tokens as authenticated users with blank identity.

**Recommendation:**
- Validate both claim presence and non-empty content.
- Return `401` for missing/invalid `id`/`name` claims.
- Optionally use strongly typed claims struct.

---

### 3) Medium: Payment handlers map domain errors to 500
**File:** `internal/payments/handler.go`

Both deposit/payout handlers return `500` for any `ProcessPayment` error. Some errors are client-driven (for example unsupported provider) and should map to `400`-class responses.

**Impact:** Incorrect API behavior and noisy server-error metrics.

**Recommendation:**
- Introduce typed/domain errors (e.g., `ErrUnsupportedProvider`, `ErrInvalidAmount`).
- Map validation/business errors to `400`/`422`; reserve `500` for infrastructure failures.

---

### 4) Medium: Verbose debug logging may leak payment metadata
**Files:** `internal/payments/handler.go`, `internal/payments/kafka.go`

Code logs raw user/payment request details and transaction IDs with standard logger.

**Impact:** Potential exposure of sensitive operational/payment metadata in logs; inconsistent observability style.

**Recommendation:**
- Remove temporary debug logs or gate behind debug level.
- Prefer structured logger used elsewhere in project.
- Redact or hash user identifiers and transaction IDs where possible.

---

### 5) Low/CI Reliability: DB tests fail without local Postgres
**File:** `pkg/dbcontext/db_test.go`

`go test ./...` currently fails because db tests require `127.0.0.1:5432` with no automatic skip when DB is unavailable.

**Impact:** Local/CI flakiness and lower signal from test suite.

**Recommendation:**
- Guard integration tests behind env flag (e.g., `RUN_DB_TESTS=1`) and `t.Skip` when unavailable.
- Or provision ephemeral DB in CI (docker-compose/testcontainers).

## Commands run
- `cd api.events.proptios.com && go test ./...`
- `npm test -- --watch=false`

## Notes
- `npm test` is not configured in the repository root (`Missing script: test`).
- `go test` passes most packages but fails in `pkg/dbcontext` due to missing local Postgres.
