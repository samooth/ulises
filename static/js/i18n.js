// static/js/i18n.js
// Lightweight translation engine — zero deps, JSON locale files, dot-path keys.

import { get, set } from './storage.js'

const STORAGE_KEY = 'ulises-lang'
const FALLBACK_LANG = 'en'

let _locale = null
let _lang = FALLBACK_LANG
let _ready = false

function _resolve(obj, path) {
  const parts = path.split('.')
  for (const p of parts) {
    if (!obj || typeof obj !== 'object') return null
    obj = obj[p]
  }
  return obj !== undefined ? obj : null
}

function _interpolate(str, vars) {
  if (!vars) return str
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{{${k}}}`
  )
}

function _detectLanguage() {
  const saved = get(STORAGE_KEY)
  if (saved) return saved
  const nav = (navigator.language || FALLBACK_LANG).split('-')[0]
  return nav || FALLBACK_LANG
}

async function _loadLocale(lang) {
  try {
    const resp = await fetch(`/static/locales/${lang}.json`)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return await resp.json()
  } catch (e) {
    if (lang !== FALLBACK_LANG) return _loadLocale(FALLBACK_LANG)
    console.warn(`[i18n] No locale for "${lang}", using empty fallback`)
    return {}
  }
}

export function t(key, vars) {
  if (!_locale) return key
  let val = _resolve(_locale, key)
  if (val === null) {
    return key
  }
  return _interpolate(val, vars)
}

function _applyTranslations(root) {
  root = root || document
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    el.textContent = t(key)
  })
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')))
  })
  root.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')))
  })
  root.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')))
  })
  root.querySelectorAll('[data-i18n-value]').forEach(el => {
    el.value = t(el.getAttribute('data-i18n-value'))
  })
}

export function setLanguage(code) {
  _lang = code
  _ready = false
  return _loadLocale(code).then(locale => {
    _locale = locale
    _ready = true
    set(STORAGE_KEY, code)
    _applyTranslations()
    document.documentElement.lang = code
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: code } }))
  })
}

export async function init() {
  _lang = _detectLanguage()
  _locale = await _loadLocale(_lang)
  _ready = true
  _applyTranslations()
  document.documentElement.lang = _lang
}

export function getCurrentLang() {
  return _lang
}

export function isReady() {
  return _ready
}

export function reapply(root) {
  _applyTranslations(root)
}
