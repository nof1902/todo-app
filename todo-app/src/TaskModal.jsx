import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import './TaskModal.css'
import DateInput from './DateInput'
import { TRANSLATIONS } from './i18n/translations'

function TaskModal({ task, statusOptions, importanceOptions, onSave, onDelete, onClose, language }) {
  const t = TRANSLATIONS[language] ?? TRANSLATIONS.en

  const [form, setForm]           = useState({ ...task })
  const [dateError, setDateError] = useState('')

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleDateChange(field, value) {
    const next = { ...form, [field]: value }
    setForm(next)
    if (next.startDate && next.endDate && next.endDate < next.startDate) {
      setDateError(t.modal.dateError)
    } else {
      setDateError('')
    }
  }

  function handleSave() {
    const text = form.text.trim()
    if (!text) return
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setDateError(t.modal.dateError)
      return
    }
    onSave({ ...form, text })
  }

  function handleDelete() {
    if (window.confirm(t.modal.deleteConfirm)) {
      onDelete(task.id)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-handle" aria-hidden="true" />

        <div className="modal-header">
          <span className="modal-header-label">{t.modal.title}</span>
          <button className="modal-close" onClick={onClose} aria-label={t.common.close}>
            <X size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div className="modal-title-section">
          <input
            type="text"
            className="modal-task-title"
            value={form.text}
            onChange={e => set('text', e.target.value)}
            placeholder={t.modal.titlePlaceholder}
            dir="auto"
          />
        </div>

        <div className="modal-body">

          <div className="modal-section">
            <div className="modal-field">
              <span className="field-label">{t.modal.status}</span>
              <div className="chip-group">
                {statusOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`chip ${form.status === opt.value ? 'chip--on' : ''}`}
                    style={{ '--chip-color': opt.color }}
                    onClick={() => set('status', opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-field">
              <span className="field-label">{t.modal.importance}</span>
              <div className="chip-group">
                {importanceOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`chip ${form.importance === opt.value ? 'chip--on' : ''}`}
                    style={{ '--chip-color': opt.color }}
                    onClick={() => set('importance', opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-section">
            <div className="modal-two-col">
              <div className="modal-field">
                <span className="field-label">{t.modal.startDate}</span>
                <DateInput
                  className="modal-input"
                  value={form.startDate}
                  onChange={v => handleDateChange('startDate', v)}
                  language={language}
                />
              </div>
              <div className="modal-field">
                <span className="field-label">{t.modal.endDate}</span>
                <DateInput
                  className={`modal-input${dateError ? ' modal-input--error' : ''}`}
                  value={form.endDate}
                  onChange={v => handleDateChange('endDate', v)}
                  language={language}
                />
              </div>
            </div>

            {dateError && <p className="field-error">{dateError}</p>}

            <div className="modal-field">
              <span className="field-label">{t.modal.dueTime}</span>
              <input
                type="time"
                className="modal-input modal-input--time"
                value={form.dueTime}
                onChange={e => set('dueTime', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-notes-section">
            <span className="field-label">{t.modal.notes}</span>
            <textarea
              className="modal-notes"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder={t.modal.notesPlaceholder}
              dir="auto"
            />
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn--danger-ghost" type="button" onClick={handleDelete}>
            {t.common.delete}
          </button>
          <div className="modal-footer-right">
            <button className="btn btn--ghost" type="button" onClick={onClose}>{t.common.cancel}</button>
            <button className="btn btn--primary" type="button" onClick={handleSave}>{t.common.save}</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TaskModal
