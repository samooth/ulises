# Translation / i18n Migration TODO

## Architecture

```
Frontend:  static/js/i18n.js      →  static/locales/{lang}.json
Backend:   core/translations.py   →  locales/{lang}.json
           (from core.translations import t)
```

## Completed Infrastructure ✅

- [x] `static/js/i18n.js` — frontend translation engine
- [x] `static/locales/en.json` — all frontend source strings
- [x] `static/locales/es.json` — full Spanish translation
- [x] `core/translations.py` — Python `t()` with ContextVar
- [x] `locales/en.json` — all backend source strings
- [x] `locales/es.json` — full Spanish backend translation
- [x] `core/middleware.py` — `LanguageMiddleware` (Accept-Language → ContextVar)
- [x] `app.py` — middleware registered, `i18n.init()` on boot
- [x] `src/settings.py` — `"app_language"` in defaults + per-user keys
- [x] `static/index.html` — 738 data-i18n attributes
- [x] `static/login.html` — data-i18n + module script + inline `window._t()`
- [x] `static/js/settings.js` — language selector init + `initLanguageSettings()`
- [x] `static/app.js` — i18n import + init + global reapply
- [x] `static/js/ui.js` — showToast wrapped with `t()`
- [x] `static/js/chat.js` — chat toasts wrapped with `t()`
- [x] Login page inline script — dynamic strings use `_t('key', 'fallback')`

---

## Remaining Work

### 1. Python Routes — `from core.translations import t` + wrap strings

**Priority: HIGH** — user-facing error messages returned via API

| File | Strings | Status |
|------|---------|--------|
| `routes/gallery_routes.py` | ~73 | |
| `routes/document_routes.py` | ~63 | |
| `routes/auth_routes.py` | ~61 | |
| `routes/task_routes.py` | ~44 | |
| `routes/codex_routes.py` | ~43 | |
| `routes/session_routes.py` | ~41 | |
| `routes/research_routes.py` | ~33 | |
| `routes/calendar_routes.py` | ~25 | |
| `routes/skills_routes.py` | ~25 | |
| `routes/history_routes.py` | ~22 | |
| `routes/upload_routes.py` | ~22 | |
| `routes/note_routes.py` | ~19 | |
| `routes/cookbook_helpers.py` | ~18 | |
| `routes/webhook_routes.py` | ~18 | |
| `routes/chat_routes.py` | ~15 | |
| `routes/embedding_routes.py` | ~15 | |
| `routes/mcp_routes.py` | ~15 (HTML) | |
| `routes/memory_routes.py` | ~15 | |
| `routes/model_routes.py` | ~14 | |
| `routes/signature_routes.py` | ~11 | |
| `routes/assistant_routes.py` | ~10 | |
| `routes/personal_routes.py` | ~10 | |
| `routes/compare_routes.py` | ~8 | |
| `routes/shell_routes.py` | ~8 | |
| `routes/api_token_routes.py` | ~7 | |
| `routes/editor_draft_routes.py` | ~6 | |
| `routes/email_helpers.py` | ~6 | |
| `routes/tts_routes.py` | ~6 | |
| `routes/cookbook_routes.py` | ~5 | |
| `routes/document_helpers.py` | ~5 | |
| `routes/stt_routes.py` | ~5 | |
| `routes/copilot_routes.py` | ~4 | |
| `routes/chat_helpers.py` | ~3 | |
| `routes/_validators.py` | ~3 | |
| `routes/admin_wipe_routes.py` | ~2 | |
| `routes/backup_routes.py` | ~2 | |
| `routes/cleanup_routes.py` | ~2 | |
| `routes/diagnostics_routes.py` | ~2 | |
| `routes/workspace_routes.py` | ~2 | |
| `routes/contacts_routes.py` | ~1 | |
| `routes/hwfit_routes.py` | ~1 | |
| `routes/preset_routes.py` | ~1 | |
| `routes/chatgpt_subscription_routes.py` | ~1 | |
| `routes/device_flow.py` | ~1 | |

### 2. Python `src/` files

| File | Strings | Status |
|------|---------|--------|
| `src/chat_helpers.py` | ~13 | |
| `src/llm_core.py` | ~11 | |
| `src/upload_handler.py` | ~5 | |
| `src/auth_helpers.py` | ~4 | |
| `src/integrations.py` | ~4 | |
| `src/generated_images.py` | ~3 | |
| `src/chat_handler.py` | ~1 | |
| `src/rate_limiter.py` | ~1 | |
| `src/upload_limits.py` | ~1 | |
| `src/chatgpt_subscription.py` | ~3 | |

### 3. Other Python

| File | Strings | Status |
|------|---------|--------|
| `app.py` | ~6 | |
| `core/middleware.py` | ~3 | |
| `companion/routes.py` | ~60 lines HTML | |

### 4. JavaScript Modules — `import { t }` + wrap showToast calls

**Priority: MEDIUM** — user-facing toast/feedback messages

| File | Toasts | Status |
|------|--------|--------|
| `cookbookRunning.js` | ~34 | |
| `galleryEditor.js` | ~30 | |
| `document.js` | ~25 | |
| `gallery.js` | ~24 | |
| `cookbookServe.js` | ~23 | |
| `cookbook.js` | ~19 | |
| `tasks.js` | ~19 | |
| `documentLibrary.js` | ~18 | |
| `notes.js` | ~18 | |
| `sessions.js` | ~17 | |
| `memory.js` | ~15 | |
| `skills.js` | ~13 | |
| `emailLibrary.js` | ~11 | |
| `cookbookDownload.js` | ~9 | |
| `cookbook-hwfit.js` | ~9 | |
| `editor/ai-inpaint.js` | ~9 | |
| `calendar.js` | ~8 | |
| `editor/ai-tools-misc.js` | ~7 | |
| `editor/keyboard-shortcuts.js` | ~7 | |
| `editor/wire-import.js` | ~7 | |
| `assistant.js` | ~6 | |
| `editor/ai-tool-runner.js` | ~5 | |
| `voiceRecorder.js` | ~5 | |
| `admin.js` | ~4 | |
| `codeRunner.js` | ~4 | |
| `fileHandler.js` | ~4 | |
| `group.js` | ~4 | |
| `editor/wire-merge-buttons.js` | ~4 | |
| `modelPicker.js` | ~4 | |
| `editor/wire-topbar.js` | ~3 | |
| `chatRenderer.js` | ~2 | |
| `cookbookSchedule.js` | ~1 | |
| `emailInbox.js` | ~2 | |
| `keyboard-shortcuts.js` | ~2 | |
| `workspace.js` | ~2 | |
| `editor/layer-panel.js` | ~2 | |
| `editor/wire-topbar-menus.js` | ~2 | |
| `editor/clipboard-and-drop.js` | ~1 | |
| `editor/wire-inpaint-controls.js` | ~1 | |
| `editor/wire-selection-controls.js` | ~1 | |
| `models.js` | ~1 | |
| `presets.js` | ~1 | |
| `calendar/reminders.js` | ~1 | |
| `settings.js` | ~6 remaining | |
| `chat.js` | ~2 remaining | |

### 5. Embedded HTML in Python Routes

| File | Content | Status |
|------|---------|--------|
| `routes/mcp_routes.py` | ~85 lines HTML ("Authorize Google Account" etc.) | |
| `companion/routes.py` | ~60 lines HTML ("Pair a device" etc.) | |
| `routes/session_routes.py` | ~24 lines HTML export template | |
| `routes/email_routes.py` | HTML email wrappers | |
| `routes/research_routes.py` | Delegates to `research_handler.get_report_html()` | |
