import { useState, useEffect } from 'react'
import './TaskModal.css'
import DateInput from './DateInput'

function TaskModal({ task, statusOptions, importanceOptions, onSave, onDelete, onClose }) {
  const [form, setForm]         = useState({ ...task })
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

  // Validates the date range whenever start or end date changes
  function handleDateChange(field, value) {
    const next = { ...form, [field]: value }
    setForm(next)
    if (next.startDate && next.endDate && next.endDate < next.startDate) {
      setDateError('End date must be on or after the start date.')
    } else {
      setDateError('')
    }
  }

  function handleSave() {
    const text = form.text.trim()
    if (!text) return
    // Final validation before saving
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setDateError('End date must be on or after the start date.')
      return
    }
    onSave({ ...form, text })
  }

  function handleDelete() {
    if (window.confirm('Delete this task? This cannot be undone.')) {
      onDelete(task.id)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* Drag handle — communicates "sheet" on mobile */}
        <div className="modal-handle" aria-hidden="true" />

        {/* Minimal header */}
        <div className="modal-header">
          <span className="modal-header-label">Edit task</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Task title — styled as a heading, not a form field */}
        <div className="modal-title-section">
          <input
            type="text"
            className="modal-task-title"
            value={form.text}
            onChange={e => set('text', e.target.value)}
            placeholder="Task title"
            dir="auto"
          />
        </div>

        {/* Scrollable body */}
        <div className="modal-body">

          {/* ── Status + Importance ── */}
          <div className="modal-section">

            <div className="modal-field">
              <span className="field-label">Status</span>
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
              <span className="field-label">Importance</span>
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

            {/* Start date + End date side by side */}
            <div className="modal-two-col">
              <div className="modal-field">
                <span className="field-label">Start date</span>
                <DateInput
                  className="modal-input"
                  value={form.startDate}
                  onChange={v => handleDateChange('startDate', v)}
                  aria-label="Start date"
                />
              </div>
              <div className="modal-field">
                <span className="field-label">End date</span>
                <DateInput
                  className={`modal-input${dateError ? ' modal-input--error' : ''}`}
                  value={form.endDate}
                  onChange={v => handleDateChange('endDate', v)}
                  aria-label="End date"
                />
              </div>
            </div>

            {/* Friendly validation message — only shown when dates conflict */}
            {dateError && (
              <p className="field-error">{dateError}</p>
            )}

            {/* Due time — separate from the date range */}
            <div className="modal-field">
              <span className="field-label">Due time</span>
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
            <span className="field-label">Notes</span>
            <textarea
              className="modal-notes"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="What's been done? What's still missing? Any important context…"
              dir="auto"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn--danger-ghost" type="button" onClick={handleDelete}>
            Delete
          </button>
          <div className="modal-footer-right">
            <button className="btn btn--ghost" type="button" onClick={onClose}>Cancel</button>
            <button className="btn btn--primary" type="button" onClick={handleSave}>Save changes</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TaskModal
