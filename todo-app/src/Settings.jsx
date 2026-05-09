import { Palette, Monitor, ClipboardList, Languages, X, Check } from 'lucide-react'
import './Settings.css'

const THEMES = [
  { id: 'default',      label: 'Default',    primary: '#4f46e5', bg: '#f0f2f6' },
  { id: 'calm-blue',    label: 'Calm Blue',  primary: '#0ea5e9', bg: '#e0f2fe' },
  { id: 'soft-green',   label: 'Soft Green', primary: '#059669', bg: '#d1fae5' },
  { id: 'warm-neutral', label: 'Warm Amber', primary: '#d97706', bg: '#fef3c7' },
]

// display: short text code shown on the language button
const LANGUAGES = [
  { code: 'en', display: 'EN', name: 'English' },
  { code: 'he', display: 'עב', name: 'עברית' },
  { code: 'es', display: 'ES', name: 'Español' },
]

// All UI strings for the Settings panel, keyed by language
const L = {
  en: {
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
  he: {
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
  es: {
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
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`st-toggle${checked ? ' is-on' : ''}`}
      onClick={() => onChange(!checked)}
    />
  )
}

function Settings({ settings, onUpdate, onClose, statusOptions, importanceOptions }) {
  const lx = L[settings.language] ?? L.en

  return (
    <div className="st-backdrop" onClick={onClose}>
      <div
        className="st-panel"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={lx.title}
      >
        {/* ── Panel header ── */}
        <div className="st-header">
          <span className="st-title">{lx.title}</span>
          <button
            type="button"
            className="st-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div className="st-body">

          {/* ── Section: Appearance ── */}
          <section className="st-section">
            <h3 className="st-section-title">
              <span className="st-section-icon"><Palette size={14} strokeWidth={2} aria-hidden="true" /></span>
              {lx.appearance}
            </h3>
            <div className="st-themes">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  className={`st-theme-btn${settings.theme === theme.id ? ' is-active' : ''}`}
                  onClick={() => onUpdate('theme', theme.id)}
                  title={theme.label}
                >
                  <span
                    className="st-swatch"
                    style={{
                      background: `linear-gradient(135deg, ${theme.bg} 50%, ${theme.primary} 50%)`,
                    }}
                  />
                  <span className="st-theme-name">{theme.label}</span>
                  {settings.theme === theme.id && (
                    <span className="st-theme-check" aria-hidden="true"><Check size={9} strokeWidth={3} /></span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ── Section: Display ── */}
          <section className="st-section">
            <h3 className="st-section-title">
              <span className="st-section-icon"><Monitor size={14} strokeWidth={2} aria-hidden="true" /></span>
              {lx.display}
            </h3>

            <div className="st-row">
              <span className="st-row-label">{lx.density}</span>
              <div className="st-segment">
                <button
                  type="button"
                  className={`st-seg-btn${settings.density === 'comfortable' ? ' is-active' : ''}`}
                  onClick={() => onUpdate('density', 'comfortable')}
                >
                  {lx.comfortable}
                </button>
                <button
                  type="button"
                  className={`st-seg-btn${settings.density === 'compact' ? ' is-active' : ''}`}
                  onClick={() => onUpdate('density', 'compact')}
                >
                  {lx.compact}
                </button>
              </div>
            </div>

            <div className="st-row">
              <span className="st-row-label">{lx.showCompleted}</span>
              <Toggle
                checked={settings.showCompleted}
                onChange={val => onUpdate('showCompleted', val)}
              />
            </div>

            <div className="st-row">
              <span className="st-row-label">{lx.bgPattern}</span>
              <Toggle
                checked={settings.backgroundPattern}
                onChange={val => onUpdate('backgroundPattern', val)}
              />
            </div>
          </section>

          {/* ── Section: New Task Defaults ── */}
          <section className="st-section">
            <h3 className="st-section-title">
              <span className="st-section-icon"><ClipboardList size={14} strokeWidth={2} aria-hidden="true" /></span>
              {lx.defaults}
            </h3>

            <div className="st-row">
              <label className="st-row-label" htmlFor="st-def-status">
                {lx.defStatus}
              </label>
              <div className="st-select-wrap">
                <select
                  id="st-def-status"
                  className="st-select"
                  value={settings.defaultStatus}
                  onChange={e => onUpdate('defaultStatus', e.target.value)}
                >
                  {statusOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="st-row">
              <label className="st-row-label" htmlFor="st-def-importance">
                {lx.defImportance}
              </label>
              <div className="st-select-wrap">
                <select
                  id="st-def-importance"
                  className="st-select"
                  value={settings.defaultImportance}
                  onChange={e => onUpdate('defaultImportance', e.target.value)}
                >
                  {importanceOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ── Section: Language ── */}
          <section className="st-section st-section--last">
            <h3 className="st-section-title">
              <span className="st-section-icon"><Languages size={14} strokeWidth={2} aria-hidden="true" /></span>
              {lx.language}
            </h3>
            <div className="st-languages">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  className={`st-lang-btn${settings.language === lang.code ? ' is-active' : ''}`}
                  onClick={() => onUpdate('language', lang.code)}
                >
                  <span className="st-lang-code">{lang.display}</span>
                  <span className="st-lang-name">{lang.name}</span>
                </button>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default Settings
