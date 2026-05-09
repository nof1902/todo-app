import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import './TaskModal.css'
import DateInput from './DateInput'
import { MODAL_TRANSLATIONS } from './i18n/translations'

function TaskModal({ task, statusOptions, importanceOptions, onSave, onDelete, onClose, language }) {
  const lx = MODAL_TRANSLATIONS[language] ?? MODAL_TRANSLATIONS.en

  const [form, setForm]           = useState({ ...task })
  const [dateError, setDateError] = useState('')

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock background scroll while open
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
      setDateError(lx.dateError)
    } else {
      setDateError('')
    }
  }

  function handleSave() {
    const text = form.text.trim()
    if (!text) return
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setDateError(lx.dateError)
      return
    }
    onSave({ ...form, text })
  }

  function handleDelete() {
    if (window.confirm(lx.deleteConfirm)) {
      onDelete(task.id)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* Drag handle — communicates "sheet" on mobile */}
        <div className="modal-handle" aria-hidden="true" />

        {/* Header */}
        <div className="modal-header">
          <span className="modal-header-label">{lx.title}</span>
          <button className="modal-close" onClick={onClose} aria-label={lx.close}>
            <X size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {/* Task title */}
        <div className="modal-title-section">
          <input
            type="text"
            className="modal-task-title"
            value={form.text}
            onChange={e => set('text', e.target.value)}
            placeholder={lx.titlePlaceholder}
            dir="auto"
          />
        </div>

        {/* Scrollable body */}
        <div className="modal-body">

          {/* ── Status + Importance ── */}
          <div className="modal-section">

            <div className="modal-field">
              <span className="field-label">{lx.status}</span>
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
              <span className="field-label">{lx.importance}</span>
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

          {/* ── Dates ── */}
          <div className="modal-section">

            <div className="modal-two-col">
              <div className="modal-field">
                <span className="field-label">{lx.startDate}</span>
                <DateInput
                  className="modal-input"
                  value={form.startDate}
                  onChange={v => handleDateChange('startDate', v)}
                />
              </div>
              <div className="modal-field">
                <span className="field-label">{lx.endDate}</span>
                <DateInput
                  className={`modal-input${dateError ? ' modal-input--error' : ''}`}
                  value={form.endDate}
                  onChange={v => handleDateChange('endDate', v)}
                />
              </div>
            </div>

            {dateError && (
              <p className="field-error">{dateError}</p>
            )}

            <div className="modal-field">
              <span className="field-label">{lx.dueTime}</span>
              <input
                type="time"
                className="modal-input modal-input--time"
                value={form.dueTime}
                onChange={e => set('dueTime', e.target.value)}
              />
            </div>

          </div>

          {/* ── Notes ── */}
          <div className="modal-notes-section">
            <span className="field-label">{lx.notes}</span>
            <textarea
              className="modal-notes"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder={lx.notesPlaceholder}
              dir="auto"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn--danger-ghost" type="button" onClick={handleDelete}>
            {lx.delete}
          </button>
          <div className="modal-footer-right">
            <button className="btn btn--ghost" type="button" onClick={onClose}>{lx.cancel}</button>
            <button className="btn btn--primary" type="button" onClick={handleSave}>{lx.save}</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TaskModal
