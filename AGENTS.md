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
