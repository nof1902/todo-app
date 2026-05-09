import { Search, X } from 'lucide-react'
import './FilterPanel.css'
import DateInput from './DateInput'
import { TRANSLATIONS } from './i18n/translations'

function shortDate(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-')
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

// Maps internal date filter key → translated label
function getDateLabel(key, t) {
  const map = {
    'today':     t.filters.date.today,
    'this-week': t.filters.date.thisWeek,
    'overdue':   t.filters.date.overdue,
    'custom':    t.filters.date.custom,
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
  const t = TRANSLATIONS[language] ?? TRANSLATIONS.en

  const hasSearch     = filters.search.trim() !== ''
  const hasStatus     = filters.status !== 'all'
  const hasImportance = filters.importance !== 'all'
  const hasDate       = filters.date !== 'all'

  function set(key, value) {
    onFilterChange(key, value)
  }

  return (
    <div className="fp">

      <div className="fp-header">
        <span className="fp-title">{t.filters.title}</span>
        {activeCount > 0 && (
          <span className="fp-active-badge">{t.filters.active(activeCount)}</span>
        )}
        {activeCount > 0 && (
          <button className="fp-clear" onClick={onClear}>
            {t.filters.clearAll}
          </button>
        )}
      </div>

      <div className="fp-controls">

        <div className="fp-search-wrap">
          <span className="fp-search-icon" aria-hidden="true">
            <Search size={14} strokeWidth={2} />
          </span>
          <input
            type="text"
            className={`fp-search${hasSearch ? ' is-active' : ''}`}
            placeholder={t.filters.searchPlaceholder}
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            dir="auto"
          />
          {hasSearch && (
            <button
              className="fp-search-clear"
              onClick={() => set('search', '')}
              aria-label={t.filters.clearSearch}
            >
              <X size={12} strokeWidth={2.5} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* opt.label is pre-translated by App.jsx via getLabel() */}
        <div className="fp-select-wrap">
          <select
            className={`fp-select${hasStatus ? ' is-active' : ''}`}
            value={filters.status}
            onChange={e => set('status', e.target.value)}
            aria-label={t.filters.status.label}
          >
            <option value="all">{t.filters.status.all}</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="fp-select-wrap">
          <select
            className={`fp-select${hasImportance ? ' is-active' : ''}`}
            value={filters.importance}
            onChange={e => set('importance', e.target.value)}
            aria-label={t.filters.importance.label}
          >
            <option value="all">{t.filters.importance.all}</option>
            {importanceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="fp-select-wrap">
          <select
            className={`fp-select${hasDate ? ' is-active' : ''}`}
            value={filters.date}
            onChange={e => set('date', e.target.value)}
            aria-label={t.filters.date.label}
          >
            <option value="all">{t.filters.date.all}</option>
            <option value="today">{t.filters.date.today}</option>
            <option value="this-week">{t.filters.date.thisWeek}</option>
            <option value="overdue">{t.filters.date.overdue}</option>
            <option value="custom">{t.filters.date.custom}</option>
          </select>
        </div>

      </div>

      {filters.date === 'custom' && (
        <div className="fp-custom-range">
          <div className="fp-date-field">
            <label className="fp-range-label">{t.filters.date.from}</label>
            <DateInput
              className="fp-date-input"
              value={filters.customFrom}
              onChange={v => set('customFrom', v)}
              language={language}
            />
          </div>
          <span className="fp-range-sep" aria-hidden="true">—</span>
          <div className="fp-date-field">
            <label className="fp-range-label">{t.filters.date.to}</label>
            <DateInput
              className="fp-date-input"
              value={filters.customTo}
              onChange={v => set('customTo', v)}
              language={language}
            />
          </div>
        </div>
      )}

      {activeCount > 0 && (
        <div className="fp-chips">
          {hasSearch && (
            <span className="fp-chip">
              "{filters.search.trim()}"
              <button
                className="fp-chip-x"
                onClick={() => set('search', '')}
                aria-label={t.filters.removeFilter}
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
                aria-label={t.filters.removeFilter}
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
                aria-label={t.filters.removeFilter}
              >
                <X size={10} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </span>
          )}
          {hasDate && (
            <span className="fp-chip">
              {getDateLabel(filters.date, t)}
              {filters.date === 'custom' && filters.customFrom && filters.customTo
                ? `: ${shortDate(filters.customFrom)} – ${shortDate(filters.customTo)}`
                : ''}
              <button
                className="fp-chip-x"
                onClick={() => { set('date', 'all'); set('customFrom', ''); set('customTo', '') }}
                aria-label={t.filters.removeFilter}
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
