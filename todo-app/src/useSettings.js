import { useState, useEffect } from 'react'

const KEY = 'app-settings'

export const SETTINGS_DEFAULTS = {
  theme:             'default',      // 'default' | 'calm-blue' | 'soft-green' | 'warm-neutral'
  density:           'comfortable',  // 'comfortable' | 'compact'
  showCompleted:     true,
  backgroundPattern: true,
  defaultStatus:     'not-started',
  defaultImportance: 'medium',
  language:          'en',           // 'en' | 'he' | 'es'
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...SETTINGS_DEFAULTS, ...JSON.parse(raw) } : { ...SETTINGS_DEFAULTS }
  } catch {
    return { ...SETTINGS_DEFAULTS }
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings))
  }, [settings])

  // Sync visual state to document root on every relevant change
  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-theme', settings.theme)
    html.setAttribute('data-density', settings.density)
    html.dir  = settings.language === 'he' ? 'rtl' : 'ltr'
    html.lang = settings.language
    document.body.classList.toggle('no-pattern', !settings.backgroundPattern)
  }, [settings.theme, settings.density, settings.backgroundPattern, settings.language])

  function updateSetting(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return { settings, updateSetting }
}
