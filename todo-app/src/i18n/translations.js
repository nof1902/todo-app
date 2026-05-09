// ─────────────────────────────────────────────────────────────────────────────
// Central translations file — single source of truth for all option arrays
// and component-level UI strings.
//
// INTERNAL VALUES (opt.value) are stable kebab-case keys used in localStorage,
// filter logic, and comparisons. They never change regardless of language.
//
// LABELS (opt.label) are objects keyed by language code. Components receive
// flat translated arrays (produced by App.jsx via getLabel) and use opt.label
// as a normal string — they never need to know about this structure.
// ─────────────────────────────────────────────────────────────────────────────

// ── Status options ────────────────────────────────────────────────────────────
export const STATUS_OPTIONS = [
  {
    value: 'not-started',
    color: '#6b7280',
    label: { en: 'Not Started', he: 'טרם התחיל', es: 'No iniciado' },
  },
  {
    value: 'in-progress',
    color: '#3b82f6',
    label: { en: 'In Progress', he: 'בתהליך', es: 'En proceso' },
  },
  {
    value: 'almost-done',
    color: '#8b5cf6',
    label: { en: 'Almost Done', he: 'לקראת סיום', es: 'Casi terminado' },
  },
  {
    value: 'partially-done',
    color: '#f59e0b',
    label: { en: 'Partially Done', he: 'בוצע חלקית', es: 'Parcialmente completado' },
  },
  {
    value: 'completed',
    color: '#10b981',
    label: { en: 'Completed', he: 'בוצע', es: 'Completado' },
  },
]

// ── Importance options ────────────────────────────────────────────────────────
export const IMPORTANCE_OPTIONS = [
  {
    value: 'critical',
    color: '#ef4444',
    label: { en: 'Critical', he: 'קריטי', es: 'Crítico' },
  },
  {
    value: 'important',
    color: '#f97316',
    label: { en: 'Important', he: 'חשוב', es: 'Importante' },
  },
  {
    value: 'medium',
    color: '#3b82f6',
    label: { en: 'Medium', he: 'בינוני', es: 'Medio' },
  },
  {
    value: 'low',
    color: '#6b7280',
    label: { en: 'Low', he: 'נמוך', es: 'Bajo' },
  },
  {
    value: 'optional',
    color: '#9ca3af',
    label: { en: 'Optional', he: 'אופציונלי', es: 'Opcional' },
  },
]

// ── Helper ────────────────────────────────────────────────────────────────────
// Returns the translated label string for the given language.
// Falls back to English if the language is unknown or missing.
export function getLabel(option, language) {
  return option.label[language] ?? option.label.en
}

// ── Task modal UI strings ─────────────────────────────────────────────────────
export const MODAL_TRANSLATIONS = {
  en: {
    title:            'Edit task',
    titlePlaceholder: 'Task title',
    status:           'Status',
    importance:       'Importance',
    startDate:        'Start date',
    endDate:          'End date',
    dueTime:          'Due time',
    notes:            'Notes',
    notesPlaceholder: "What's been done? What's still missing? Any important context…",
    save:             'Save changes',
    cancel:           'Cancel',
    delete:           'Delete',
    close:            'Close',
    dateError:        'End date must be on or after the start date.',
    deleteConfirm:    'Delete this task? This cannot be undone.',
  },
  he: {
    title:            'עריכת משימה',
    titlePlaceholder: 'כותרת המשימה',
    status:           'סטטוס',
    importance:       'חשיבות',
    startDate:        'מתאריך',
    endDate:          'עד תאריך',
    dueTime:          'שעה',
    notes:            'הערות',
    notesPlaceholder: 'מה בוצע? מה עוד חסר? הקשר חשוב...',
    save:             'שמירת שינויים',
    cancel:           'ביטול',
    delete:           'מחיקה',
    close:            'סגירה',
    dateError:        'תאריך הסיום חייב להיות שווה או מאוחר מתאריך ההתחלה.',
    deleteConfirm:    'למחוק את המשימה? לא ניתן לבטל פעולה זו.',
  },
  es: {
    title:            'Editar tarea',
    titlePlaceholder: 'Título de la tarea',
    status:           'Estado',
    importance:       'Prioridad',
    startDate:        'Fecha de inicio',
    endDate:          'Fecha de fin',
    dueTime:          'Hora límite',
    notes:            'Notas',
    notesPlaceholder: '¿Qué se ha hecho? ¿Qué falta? Contexto importante...',
    save:             'Guardar cambios',
    cancel:           'Cancelar',
    delete:           'Eliminar',
    close:            'Cerrar',
    dateError:        'La fecha de fin debe ser igual o posterior a la fecha de inicio.',
    deleteConfirm:    '¿Eliminar esta tarea? Esta acción no se puede deshacer.',
  },
}

// ── Task card UI strings ──────────────────────────────────────────────────────
export const CARD_TRANSLATIONS = {
  en: {
    editLabel:      'Edit task',
    deleteLabel:    'Delete task',
    moreLabel:      'More actions',
    editText:       'Edit',
    deleteText:     'Delete',
    deleteConfirm:  'Delete this task?',
    toggleComplete: 'Toggle complete',
  },
  he: {
    editLabel:      'עריכת משימה',
    deleteLabel:    'מחיקת משימה',
    moreLabel:      'פעולות נוספות',
    editText:       'עריכה',
    deleteText:     'מחיקה',
    deleteConfirm:  'למחוק את המשימה?',
    toggleComplete: 'שנה סטטוס',
  },
  es: {
    editLabel:      'Editar tarea',
    deleteLabel:    'Eliminar tarea',
    moreLabel:      'Más acciones',
    editText:       'Editar',
    deleteText:     'Eliminar',
    deleteConfirm:  '¿Eliminar esta tarea?',
    toggleComplete: 'Cambiar estado',
  },
}
