import { Palette, Monitor, ClipboardList, Languages, X, Check } from 'lucide-react'
import './Settings.css'
import { THEMES, LANGUAGES, TRANSLATIONS } from './i18n/translations'

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
  const t = TRANSLATIONS[settings.language] ?? TRANSLATIONS.en

  return (
    <div className="st-backdrop" onClick={onClose}>
      <div
        className="st-panel"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t.settings.title}
      >
        <div className="st-header">
          <span className="st-title">{t.settings.title}</span>
          <button
            type="button"
            className="st-close"
            onClick={onClose}
            aria-label={t.common.close}
          >
            <X size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div className="st-body">

          {/* ── Appearance ── */}
          <section className="st-section">
            <h3 className="st-section-title">
              <span className="st-section-icon"><Palette size={14} strokeWidth={2} aria-hidden="true" /></span>
              {t.settings.appearance}
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
                    <span className="st-theme-check" aria-hidden="true">
                      <Check size={9} strokeWidth={3} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ── Display ── */}
          <section className="st-section">
            <h3 className="st-section-title">
              <span className="st-section-icon"><Monitor size={14} strokeWidth={2} aria-hidden="true" /></span>
              {t.settings.display}
            </h3>

            <div className="st-row">
              <span className="st-row-label">{t.settings.density}</span>
              <div className="st-segment">
                <button
                  type="button"
                  className={`st-seg-btn${settings.density === 'comfortable' ? ' is-active' : ''}`}
                  onClick={() => onUpdate('density', 'comfortable')}
                >
                  {t.settings.comfortable}
                </button>
                <button
                  type="button"
                  className={`st-seg-btn${settings.density === 'compact' ? ' is-active' : ''}`}
                  onClick={() => onUpdate('density', 'compact')}
                >
                  {t.settings.compact}
                </button>
              </div>
            </div>

            <div className="st-row">
              <span className="st-row-label">{t.settings.showCompleted}</span>
              <Toggle
                checked={settings.showCompleted}
                onChange={val => onUpdate('showCompleted', val)}
              />
            </div>

            <div className="st-row">
              <span className="st-row-label">{t.settings.bgPattern}</span>
              <Toggle
                checked={settings.backgroundPattern}
                onChange={val => onUpdate('backgroundPattern', val)}
              />
            </div>
          </section>

          {/* ── New Task Defaults ── */}
          <section className="st-section">
            <h3 className="st-section-title">
              <span className="st-section-icon"><ClipboardList size={14} strokeWidth={2} aria-hidden="true" /></span>
              {t.settings.defaults}
            </h3>

            <div className="st-row">
              <label className="st-row-label" htmlFor="st-def-status">
                {t.settings.defStatus}
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
                {t.settings.defImportance}
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

          {/* ── Language ── */}
          <section className="st-section st-section--last">
            <h3 className="st-section-title">
              <span className="st-section-icon"><Languages size={14} strokeWidth={2} aria-hidden="true" /></span>
              {t.settings.language}
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
