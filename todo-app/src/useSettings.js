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

export const TRANSLATIONS = {
  en: {
    appTitle:        'My Tasks',
    appSubtitle:     'Stay organized, stay focused',
    addPlaceholder:  'Add a new task…',
    addButton:       '+ Add',
    remaining:       n => `${n} ${n === 1 ? 'task' : 'tasks'} remaining`,
    clearCompleted:  n => `Clear ${n} completed`,
    emptyNoTasks:    'No tasks yet!',
    emptyNoMatch:    'No matching tasks',
    emptyNoTasksSub: 'Add a task above to get started.',
    emptyNoMatchSub: 'Try adjusting your filters.',
    emptyNoTasksIcon: '🎉',
    emptyNoMatchIcon: '🔍',
    settingsLabel:   'Settings',
  },
  he: {
    appTitle:        'המשימות שלי',
    appSubtitle:     'כל המשימות, במקום אחד.',
    addPlaceholder:  'הוסף משימה חדשה…',
    addButton:       '+ הוסף',
    remaining:       n => `נותרו ${n} ${n === 1 ? 'משימה' : 'משימות'}`,
    clearCompleted:  n => `נקה ${n} שהושלמו`,
    emptyNoTasks:    '!אין משימות עדיין',
    emptyNoMatch:    'לא נמצאו משימות',
    emptyNoTasksSub: 'הוסף משימה למעלה כדי להתחיל.',
    emptyNoMatchSub: 'נסה לשנות את הפילטרים.',
    emptyNoTasksIcon: '🎉',
    emptyNoMatchIcon: '🔍',
    settingsLabel:   'הגדרות',
  },
  es: {
    appTitle:        'Mis Tareas',
    appSubtitle:     'Organízate, mantén el foco',
    addPlaceholder:  'Agregar una tarea nueva…',
    addButton:       '+ Agregar',
    remaining:       n => `${n} ${n === 1 ? 'tarea pendiente' : 'tareas pendientes'}`,
    clearCompleted:  n => `Eliminar ${n} completadas`,
    emptyNoTasks:    '¡Sin tareas aún!',
    emptyNoMatch:    'No hay tareas coincidentes',
    emptyNoTasksSub: 'Agrega una tarea arriba para comenzar.',
    emptyNoMatchSub: 'Intenta ajustar los filtros.',
    emptyNoTasksIcon: '🎉',
    emptyNoMatchIcon: '🔍',
    settingsLabel:   'Configuración',
  },
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
