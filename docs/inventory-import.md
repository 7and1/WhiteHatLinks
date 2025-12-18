# Inventory import (D1)

Use this when you want the Cloudflare D1 database to hold the inventory so runtime doesn’t need filesystem access.

## Requirements
- The source file available locally: `/Volumes/SSD/dev/links/dobacklinks/scraper/active-sites-incremental.json` (or set `INVENTORY_JSON_PATH`).
- D1 bindings configured via `wrangler.toml` / `CLOUDFLARE_ENV` and `PAYLOAD_SECRET`.

## Command
```bash
# optional: adjust LIMIT (default 2000) and CONCURRENCY (default 10)
INVENTORY_JSON_PATH=/path/to/active-sites-incremental.json LIMIT=5000 pnpm import:inventory
```

What it does:
- Loads items via the same transformer as the app (DR/traffic parsing + 2× price, niche inference).
- Upserts into the `inventory` collection by `domain` (updates existing, otherwise creates).
- Sets `status` to `Available` and keeps `region`/`dr`/`traffic`/`price` aligned with source.

## Tips
- For full 17k rows, bump `LIMIT` gradually (e.g., 5000, then 10000) to avoid long runs on remote D1.
- Re-run any time the JSON updates; imports are idempotent on `domain`.
- After import, `pnpm deploy:database` will still run migrations/PRAGMA optimize, but data is already present.
