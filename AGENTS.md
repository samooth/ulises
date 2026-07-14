# Ulises — AI Agent Guide

## Stack
Python 3.10+ · FastAPI · SQLAlchemy 2.0+ (SQLite) · ChromaDB · vanilla ES6 modules

## Layout
| Directory | Purpose |
|-----------|---------|
| `routes/` | FastAPI route handlers (one per domain) |
| `src/` | Business logic (LLM, RAG, search, tools, memory) |
| `core/` | Shared abstractions (db, auth, middleware, models) |
| `services/` | Subsystems (memory, search, research, TTS, STT, shell) |
| `static/js/` | Frontend ES6 modules (~90 files, no build step) |
| `tests/` | pytest tests (~600 files, asyncio_mode=auto) |

## Conventions
- **snake_case** for Python identifiers, **kebab-case** for URL paths
- Route modules export `setup_*_routes(...)` factory returning `APIRouter`
- Auth guard: `require_admin(request)` from `core/middleware`
- i18n: `t("namespace.key")` in Python, `t('namespace.key')` in JS
- Error responses: `{"error": "CODE", "message": "..."}` or `HTTPException`

## Run
```bash
python -m uvicorn app:app --host 127.0.0.1 --port 7000
```

## Test
```bash
python -m pytest tests/ -v -x
```

## i18n
See [MULTILANG.md](MULTILANG.md) for the multilanguage system.

## Work State

### Objective
Get CI green across all test suites and Docker build for the Ulises project.

### Known Issues
- **Docker build**: `numpy<2.0.0,>=1.26.0` conflicts with `fastembed>=0.3.0` on Python 3.13 (docker `python:3.13-slim`). fastembed 0.5+ requires numpy>=2.1.0 on py3.13. Fix: remove upper bound on numpy.
- **Local test env**: `core/translations.py:48` uses `str | None` union syntax (Python 3.10+) but env is Python 3.9 → `TypeError` on import. Fix: switch to `Optional[str]` or `from __future__ import annotations`.
- **CI test failures**: 61 failures after committed fixes (down from 93). Clusters around workspace confinement, web_fetch size caps, locale-loading edge cases.
- **`test_glob_confined_e2e`**: Exit code 1 when expecting 0. Glob's escaping-pattern handling needs investigation.

### Completed
- `{{var}}` → `{var}` in both locale files for Python `.format()` compat.
- Added `cookbook.diagnosis.*` (21 keys) + `invalid_remote_host` to both locales.
- Fixed validator namespace (`validation.*` → `validators.*`).
- Registered `ADMIN_TOOL_HANDLERS` in `TOOL_HANDLERS`.
- Fixed `_active_document_relevant` NameError in `src/agent_loop.py`.
- Standardised file-too-large error messages across chat_helpers, upload_handler, upload_limits.
- Added `start_time`/`end_time` to calendar alias list; `query_raw` partial-range rejection.
- `read_byte_limit_env` falls back to legacy `ODYSSEUS_*` vars.
- Restored `vet_workspace()` in `src/tool_execution.py`.
- Updated test paths for memory_routes shim; fixed upload-limits assertion.
- `WebFetchTool.execute` prepends `[partial content: ...]` when `result.truncated`.
- Webhook tests assert `X-Ulises-Event` (not `X-Odysseus-Event`).
- Workspace confinement: grep/glob/ls tools receive `workspace` in ctx.
- Locale files split from 4 monolithic JSONs into per-namespace directories.
- `core/translations.py` loads from directory using `dict.update()`.
- `GET /api/i18n/{lang}` endpoint; `static/js/i18n.js` fetches from API.
- `./i18n.js` import stubbed in markdown JS test harnesses.
- `GlobTool._glob` wraps `p.relative_to(base)` in `try/except ValueError` → `continue`.
- `WebFetchTool.execute` parses `full` param and passes `max_bytes=WEB_FETCH_HARD_MAX_BYTES`.
