import { Search, X } from 'lucide-react'
import './FilterPanel.css'
import DateInput from './DateInput'

// Converts "2026-05-07" → "07/05/2026"  (dd/mm/yyyy format)
function shortDate(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-')
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

// ── Filter panel UI strings, keyed by language ────────────────────
// Status and importance option labels are NOT duplicated here — they
// arrive pre-translated via the statusOptions / importanceOptions props
// (computed in App.jsx from the shared src/i18n/translations.js file).
const FP_LABELS = {
  en: {
    title:             'Filters',
    clearAll:          'Clear all',
    active:            n => `${n} active`,
    searchPlaceholder: 'Search tasks…',
    status:    { label: 'Status',     all: 'All statuses' },
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

  he: {
    title:             'סינונים',
    clearAll:          'נקה הכול',
    active:            n => n === 1 ? 'סינון אחד פעיל' : `${n} סינונים פעילים`,
    searchPlaceholder: 'חיפוש משימות...',
    status:    { label: 'סטטוס',   all: 'כל הסטטוסים' },
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

  es: {
    title:             'Filtros',
    clearAll:          'Limpiar todo',
    active:            n => n === 1 ? '1 activo' : `${n} activos`,
    searchPlaceholder: 'Buscar tareas...',
    status:    { label: 'Estado',    all: 'Todos los estados' },
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
}

// Maps internal date filter key → translated label from lx.date
function getDateLabel(key, lx) {
  const map = {
    'today':     lx.date.today,
    'this-week': lx.date.thisWeek,
    'overdue':   lx.date.overdue,
    'custom':    lx.date.custom,
  }
  return map[key] ?? key
}

function FilterPanel({
  filters,
  onFilterChange,
  onClear,
  activeCount,
  statusOptions,
  importanceOptions,
  language,
}) {
  const lx = FP_LABELS[language] ?? FP_LABELS.en

  const hasSearch     = filters.search.trim() !== ''
  const hasStatus     = filters.status !== 'all'
  const hasImportance = filters.importance !== 'all'
  const hasDate       = filters.date !== 'all'

  function set(key, value) {
    onFilterChange(key, value)
  }

  return (
    <div className="fp">

      {/* ── Header ── */}
      <div className="fp-header">
        <span className="fp-title">{lx.title}</span>
        {activeCount > 0 && (
          <span className="fp-active-badge">{lx.active(activeCount)}</span>
        )}
        {activeCount > 0 && (
          <button className="fp-clear" onClick={onClear}>
            {lx.clearAll}
          </button>
        )}
      </div>

      {/* ── Controls row ── */}
      <div className="fp-controls">

        {/* Search */}
        <div className="fp-search-wrap">
          <span className="fp-search-icon" aria-hidden="true">
            <Search size={14} strokeWidth={2} />
          </span>
          <input
            type="text"
            className={`fp-search${hasSearch ? ' is-active' : ''}`}
            placeholder={lx.searchPlaceholder}
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            dir="auto"
          />
          {hasSearch && (
            <button
              className="fp-search-clear"
              onClick={() => set('search', '')}
              aria-label="Clear search"
            >
              <X size={12} strokeWidth={2.5} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Status — value is always the stable internal key; opt.label is pre-translated */}
        <div className="fp-select-wrap">
          <select
            className={`fp-select${hasStatus ? ' is-active' : ''}`}
            value={filters.status}
            onChange={e => set('status', e.target.value)}
            aria-label={lx.status.label}
          >
            <option value="all">{lx.status.all}</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Importance — value is always the stable internal key; opt.label is pre-translated */}
        <div className="fp-select-wrap">
          <select
            className={`fp-select${hasImportance ? ' is-active' : ''}`}
            value={filters.importance}
            onChange={e => set('importance', e.target.value)}
            aria-label={lx.importance.label}
          >
            <option value="all">{lx.importance.all}</option>
            {importanceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Date — value is always the stable internal key */}
        <div className="fp-select-wrap">
          <select
            className={`fp-select${hasDate ? ' is-active' : ''}`}
            value={filters.date}
            onChange={e => set('date', e.target.value)}
            aria-label={lx.date.label}
          >
            <option value="all">{lx.date.all}</option>
            <option value="today">{lx.date.today}</option>
            <option value="this-week">{lx.date.thisWeek}</option>
            <option value="overdue">{lx.date.overdue}</option>
            <option value="custom">{lx.date.custom}</option>
          </select>
        </div>

      </div>

      {/* ── Custom date range ── */}
      {filters.date === 'custom' && (
        <div className="fp-custom-range">
          <div className="fp-date-field">
            <label className="fp-range-label">{lx.date.from}</label>
            <DateInput
              className="fp-date-input"
              value={filters.customFrom}
              onChange={v => set('customFrom', v)}
            />
          </div>
          <span className="fp-range-sep" aria-hidden="true">—</span>
          <div className="fp-date-field">
            <label className="fp-range-label">{lx.date.to}</label>
            <DateInput
              className="fp-date-input"
              value={filters.customTo}
              onChange={v => set('customTo', v)}
            />
          </div>
        </div>
      )}

      {/* ── Active filter chips ── */}
      {activeCount > 0 && (
        <div className="fp-chips">
          {hasSearch && (
            <span className="fp-chip">
              "{filters.search.trim()}"
              <button
                className="fp-chip-x"
                onClick={() => set('search', '')}
                aria-label="Remove search filter"
              >
                <X size={10} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </span>
          )}
          {hasStatus && (
            <span className="fp-chip">
              {statusOptions.find(s => s.value === filters.status)?.label ?? filters.status}
              <button
                className="fp-chip-x"
                onClick={() => set('status', 'all')}
                aria-label="Remove status filter"
              >
                <X size={10} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </span>
          )}
          {hasImportance && (
            <span className="fp-chip">
              {importanceOptions.find(i => i.value === filters.importance)?.label ?? filters.importance}
              <button
                className="fp-chip-x"
                onClick={() => set('importance', 'all')}
                aria-label="Remove importance filter"
              >
                <X size={10} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </span>
          )}
          {hasDate && (
            <span className="fp-chip">
              {getDateLabel(filters.date, lx)}
              {filters.date === 'custom' && filters.customFrom && filters.customTo
                ? `: ${shortDate(filters.customFrom)} – ${shortDate(filters.customTo)}`
                : ''}
              <button
                className="fp-chip-x"
                onClick={() => { set('date', 'all'); set('customFrom', ''); set('customTo', '') }}
                aria-label="Remove date filter"
              >
                <X size={10} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </span>
          )}
        </div>
      )}

    </div>
  )
}

export default FilterPanel
