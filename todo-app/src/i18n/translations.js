// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all UI text, option arrays, and shared constants.
//
// Usage pattern in components:
//   import { TRANSLATIONS, STATUS_OPTIONS, ... } from './i18n/translations'
//   const t = TRANSLATIONS[language] ?? TRANSLATIONS.en
//   t.app.title, t.filters.searchPlaceholder, t.date.monthsLong, ...
//
// Option arrays use stable internal values (kebab-case) for logic/storage.
// Labels are multilingual objects consumed via getLabel() in App.jsx.
// ─────────────────────────────────────────────────────────────────────────────

// ── Status options ────────────────────────────────────────────────────────────
export const STATUS_OPTIONS = [
  { value: 'not-started',    color: '#6b7280', label: { en: 'Not Started',    he: 'טרם התחיל',    es: 'No iniciado' } },
  { value: 'in-progress',    color: '#3b82f6', label: { en: 'In Progress',    he: 'בתהליך',        es: 'En proceso' } },
  { value: 'almost-done',    color: '#8b5cf6', label: { en: 'Almost Done',    he: 'לקראת סיום',    es: 'Casi terminado' } },
  { value: 'partially-done', color: '#f59e0b', label: { en: 'Partially Done', he: 'בוצע חלקית',    es: 'Parcialmente completado' } },
  { value: 'completed',      color: '#10b981', label: { en: 'Completed',      he: 'בוצע',           es: 'Completado' } },
]

// ── Importance options ────────────────────────────────────────────────────────
export const IMPORTANCE_OPTIONS = [
  { value: 'critical',  color: '#ef4444', label: { en: 'Critical',  he: 'קריטי',    es: 'Crítico' } },
  { value: 'important', color: '#f97316', label: { en: 'Important', he: 'חשוב',      es: 'Importante' } },
  { value: 'medium',    color: '#3b82f6', label: { en: 'Medium',    he: 'בינוני',    es: 'Medio' } },
  { value: 'low',       color: '#6b7280', label: { en: 'Low',       he: 'נמוך',      es: 'Bajo' } },
  { value: 'optional',  color: '#9ca3af', label: { en: 'Optional',  he: 'אופציונלי', es: 'Opcional' } },
]

// ── Theme definitions ─────────────────────────────────────────────────────────
// Labels are design/brand names — not translated.
export const THEMES = [
  { id: 'default',      label: 'Default',    primary: '#4f46e5', bg: '#f0f2f6' },
  { id: 'calm-blue',    label: 'Calm Blue',  primary: '#0ea5e9', bg: '#e0f2fe' },
  { id: 'soft-green',   label: 'Soft Green', primary: '#059669', bg: '#d1fae5' },
  { id: 'warm-neutral', label: 'Warm Amber', primary: '#d97706', bg: '#fef3c7' },
]

// ── Language selector options ─────────────────────────────────────────────────
// Names are in their own language — no cross-language translation needed.
export const LANGUAGES = [
  { code: 'en', display: 'EN', name: 'English' },
  { code: 'he', display: 'עב', name: 'עברית' },
  { code: 'es', display: 'ES', name: 'Español' },
]

// ── Helper: extract a flat translated string from a multilingual option ────────
export function getLabel(option, language) {
  return option.label[language] ?? option.label.en
}

// ── Translations ─────────────────────────────────────────────────────────────
// Structure: TRANSLATIONS[language][section][key]
// Sections:
//   app      — app shell (header, footer, add form, empty states)
//   common   — shared action labels (close, cancel, save, delete, edit)
//   modal    — task edit modal (field labels, placeholders, validation)
//   card     — task card (aria-labels, menu items, confirmations)
//   filters  — filter panel (title, search, dropdowns, chips)
//   settings — settings panel (section titles, toggle labels)
//   date     — date picker (month names, nav labels, today button)
export const TRANSLATIONS = {

  // ── English ────────────────────────────────────────────────────────────────
  en: {
    app: {
      title:           'My Tasks',
      subtitle:        'Stay organized, stay focused',
      addPlaceholder:  'Add a new task…',
      addButton:       '+ Add',
      remaining:       n => `${n} ${n === 1 ? 'task' : 'tasks'} remaining`,
      clearCompleted:  n => `Clear ${n} completed`,
      emptyNoTasks:    'No tasks yet!',
      emptyNoMatch:    'No matching tasks',
      emptyNoTasksSub: 'Add a task above to get started.',
      emptyNoMatchSub: 'Try adjusting your filters.',
    },
    common: {
      close:  'Close',
      cancel: 'Cancel',
      save:   'Save changes',
      delete: 'Delete',
      edit:   'Edit',
    },
    modal: {
      title:            'Edit task',
      titlePlaceholder: 'Task title',
      status:           'Status',
      importance:       'Importance',
      startDate:        'Start date',
      endDate:          'End date',
      dueTime:          'Due time',
      notes:            'Notes',
      notesPlaceholder: "What's been done? What's still missing? Any important context…",
      dateError:        'End date must be on or after the start date.',
      deleteConfirm:    'Delete this task? This cannot be undone.',
    },
    card: {
      editLabel:      'Edit task',
      deleteLabel:    'Delete task',
      moreLabel:      'More actions',
      deleteConfirm:  'Delete this task?',
      toggleComplete: 'Toggle complete',
    },
    filters: {
      title:             'Filters',
      clearAll:          'Clear all',
      active:            n => `${n} active`,
      searchPlaceholder: 'Search tasks…',
      clearSearch:       'Clear search',
      removeFilter:      'Remove filter',
      status:     { label: 'Status',     all: 'All statuses' },
      importance: { label: 'Importance', all: 'All importance' },
      date: {
        label:    'Date',
        all:      'All dates',
        today:    'Today',
        thisWeek: 'This week',
        overdue:  'Overdue',
        custom:   'Custom range',
        from:     'From',
        to:       'To',
      },
    },
    settings: {
      title:         'Settings',
      appearance:    'Appearance',
      display:       'Display',
      defaults:      'New Task Defaults',
      language:      'Language',
      density:       'Density',
      comfortable:   'Comfortable',
      compact:       'Compact',
      showCompleted: 'Show completed tasks',
      bgPattern:     'Background pattern',
      defStatus:     'Default status',
      defImportance: 'Default importance',
    },
    date: {
      monthsLong:      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthsShort:     ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      today:           'Today',
      prevYear:        'Previous year',
      nextYear:        'Next year',
      prevMonth:       'Previous month',
      nextMonth:       'Next month',
      selectYear:      'Select year',
      selectMonthYear: 'Select month and year',
      placeholder:     'dd/mm/yyyy',
    },
  },

  // ── Hebrew ─────────────────────────────────────────────────────────────────
  he: {
    app: {
      title:           'המשימות שלי',
      subtitle:        'כל המשימות, במקום אחד.',
      addPlaceholder:  'הוסף משימה חדשה…',
      addButton:       '+ הוסף',
      remaining:       n => `נותרו ${n} ${n === 1 ? 'משימה' : 'משימות'}`,
      clearCompleted:  n => `נקה ${n} שהושלמו`,
      emptyNoTasks:    '!אין משימות עדיין',
      emptyNoMatch:    'לא נמצאו משימות',
      emptyNoTasksSub: 'הוסף משימה למעלה כדי להתחיל.',
      emptyNoMatchSub: 'נסה לשנות את הפילטרים.',
    },
    common: {
      close:  'סגירה',
      cancel: 'ביטול',
      save:   'שמירת שינויים',
      delete: 'מחיקה',
      edit:   'עריכה',
    },
    modal: {
      title:            'עריכת משימה',
      titlePlaceholder: 'כותרת המשימה',
      status:           'סטטוס',
      importance:       'חשיבות',
      startDate:        'מתאריך',
      endDate:          'עד תאריך',
      dueTime:          'שעה',
      notes:            'הערות',
      notesPlaceholder: 'מה בוצע? מה עוד חסר? הקשר חשוב...',
      dateError:        'תאריך הסיום חייב להיות שווה או מאוחר מתאריך ההתחלה.',
      deleteConfirm:    'למחוק את המשימה? לא ניתן לבטל פעולה זו.',
    },
    card: {
      editLabel:      'עריכת משימה',
      deleteLabel:    'מחיקת משימה',
      moreLabel:      'פעולות נוספות',
      deleteConfirm:  'למחוק את המשימה?',
      toggleComplete: 'שנה סטטוס',
    },
    filters: {
      title:             'סינונים',
      clearAll:          'נקה הכול',
      active:            n => n === 1 ? 'סינון אחד פעיל' : `${n} סינונים פעילים`,
      searchPlaceholder: 'חיפוש משימות...',
      clearSearch:       'נקה חיפוש',
      removeFilter:      'הסר סינון',
      status:     { label: 'סטטוס',   all: 'כל הסטטוסים' },
      importance: { label: 'חשיבות', all: 'כל רמות החשיבות' },
      date: {
        label:    'תאריך',
        all:      'כל התאריכים',
        today:    'היום',
        thisWeek: 'השבוע',
        overdue:  'באיחור',
        custom:   'טווח מותאם',
        from:     'מתאריך',
        to:       'עד תאריך',
      },
    },
    settings: {
      title:         'הגדרות',
      appearance:    'מראה',
      display:       'תצוגה',
      defaults:      'ברירות מחדל',
      language:      'שפה',
      density:       'צפיפות',
      comfortable:   'נוחה',
      compact:       'קומפקטי',
      showCompleted: 'הצג משימות שהושלמו',
      bgPattern:     'תבנית רקע',
      defStatus:     'סטטוס ברירת מחדל',
      defImportance: 'חשיבות ברירת מחדל',
    },
    date: {
      monthsLong:      ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
      monthsShort:     ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
      today:           'היום',
      prevYear:        'שנה קודמת',
      nextYear:        'שנה הבאה',
      prevMonth:       'חודש קודם',
      nextMonth:       'חודש הבא',
      selectYear:      'בחר שנה',
      selectMonthYear: 'בחר חודש ושנה',
      placeholder:     'dd/mm/yyyy',
    },
  },

  // ── Spanish ────────────────────────────────────────────────────────────────
  es: {
    app: {
      title:           'Mis Tareas',
      subtitle:        'Organízate, mantén el foco',
      addPlaceholder:  'Agregar una tarea nueva…',
      addButton:       '+ Agregar',
      remaining:       n => `${n} ${n === 1 ? 'tarea pendiente' : 'tareas pendientes'}`,
      clearCompleted:  n => `Eliminar ${n} completadas`,
      emptyNoTasks:    '¡Sin tareas aún!',
      emptyNoMatch:    'No hay tareas coincidentes',
      emptyNoTasksSub: 'Agrega una tarea arriba para comenzar.',
      emptyNoMatchSub: 'Intenta ajustar los filtros.',
    },
    common: {
      close:  'Cerrar',
      cancel: 'Cancelar',
      save:   'Guardar cambios',
      delete: 'Eliminar',
      edit:   'Editar',
    },
    modal: {
      title:            'Editar tarea',
      titlePlaceholder: 'Título de la tarea',
      status:           'Estado',
      importance:       'Prioridad',
      startDate:        'Fecha de inicio',
      endDate:          'Fecha de fin',
      dueTime:          'Hora límite',
      notes:            'Notas',
      notesPlaceholder: '¿Qué se ha hecho? ¿Qué falta? Contexto importante...',
      dateError:        'La fecha de fin debe ser igual o posterior a la fecha de inicio.',
      deleteConfirm:    '¿Eliminar esta tarea? Esta acción no se puede deshacer.',
    },
    card: {
      editLabel:      'Editar tarea',
      deleteLabel:    'Eliminar tarea',
      moreLabel:      'Más acciones',
      deleteConfirm:  '¿Eliminar esta tarea?',
      toggleComplete: 'Cambiar estado',
    },
    filters: {
      title:             'Filtros',
      clearAll:          'Limpiar todo',
      active:            n => n === 1 ? '1 activo' : `${n} activos`,
      searchPlaceholder: 'Buscar tareas...',
      clearSearch:       'Limpiar búsqueda',
      removeFilter:      'Eliminar filtro',
      status:     { label: 'Estado',    all: 'Todos los estados' },
      importance: { label: 'Prioridad', all: 'Todas las prioridades' },
      date: {
        label:    'Fecha',
        all:      'Todas las fechas',
        today:    'Hoy',
        thisWeek: 'Esta semana',
        overdue:  'Vencidas',
        custom:   'Rango personalizado',
        from:     'Desde',
        to:       'Hasta',
      },
    },
    settings: {
      title:         'Configuración',
      appearance:    'Apariencia',
      display:       'Pantalla',
      defaults:      'Valores predeterminados',
      language:      'Idioma',
      density:       'Densidad',
      comfortable:   'Cómodo',
      compact:       'Compacto',
      showCompleted: 'Mostrar completadas',
      bgPattern:     'Patrón de fondo',
      defStatus:     'Estado predeterminado',
      defImportance: 'Importancia predeterminada',
    },
    date: {
      monthsLong:      ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort:     ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      today:           'Hoy',
      prevYear:        'Año anterior',
      nextYear:        'Año siguiente',
      prevMonth:       'Mes anterior',
      nextMonth:       'Mes siguiente',
      selectYear:      'Seleccionar año',
      selectMonthYear: 'Seleccionar mes y año',
      placeholder:     'dd/mm/yyyy',
    },
  },
}
