# core/translations.py
# Lightweight translation engine for the Python backend.
# Loads JSON locale files and provides gettext-style `_()` lookups.

import json
import os
import logging
from functools import lru_cache

logger = logging.getLogger(__name__)

LOCALES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "locales")


@lru_cache(maxsize=16)
def _load_translations(lang: str) -> dict:
    """Load a locale JSON file, falling back to English."""
    path = os.path.join(LOCALES_DIR, f"{lang}.json")
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        if lang != "en":
            logger.warning("Locale not found for '%s', falling back to 'en'", lang)
            return _load_translations("en")
        logger.warning("English locale not found at %s, using fallback", path)
        return {}
    except json.JSONDecodeError as e:
        logger.error("Failed to parse locale '%s': %s", lang, e)
        if lang != "en":
            return _load_translations("en")
        return {}


def _resolve(obj: dict, key: str) -> str | None:
    """Resolve a dot-separated key in a nested dict."""
    parts = key.split(".")
    for p in parts:
        if isinstance(obj, dict) and p in obj:
            obj = obj[p]
        else:
            return None
    if isinstance(obj, str):
        return obj
    return None


def get_translator(lang: str = "en"):
    """Return a `_(key)` callable for the given language.

    Usage::

        from core.translations import get_translator

        _ = get_translator("es")
        detail = _("auth.login_failed")
    """
    locale = _load_translations(lang)
    fallback = _load_translations("en") if lang != "en" else locale

    def _(key: str) -> str:
        val = _resolve(locale, key)
        if val is not None:
            return val
        val = _resolve(fallback, key)
        if val is not None:
            return val
        return key

    return _


# Module-level context: set once per request via middleware.
from contextvars import ContextVar

current_language: ContextVar[str] = ContextVar("current_language", default="en")


def t(key: str) -> str:
    """Translate `key` using the current request's language.

    Intended for use in route handlers after the language middleware
    has run::

        from core.translations import t

        raise HTTPException(404, detail=t("chat.session_not_found"))
    """
    lang = current_language.get()
    translator = get_translator(lang)
    return translator(key)
