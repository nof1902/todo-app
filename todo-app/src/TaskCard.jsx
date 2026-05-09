import { useState, useEffect, useRef } from 'react'
import { Pencil, Trash2, MoreHorizontal, Check, Calendar } from 'lucide-react'
import { CARD_TRANSLATIONS } from './i18n/translations'

// ── Date formatting helpers ────────────────────────────────────────

function formatDate(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-')
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

function formatTime(str) {
  if (!str) return ''
  return str
}

function formatDateRange(startDate, endDate, dueTime) {
  const start = formatDate(startDate)
  const end   = formatDate(endDate)
  const time  = formatTime(dueTime)
  const date  = (start && end && start !== end) ? `${start} – ${end}` : (start || end)
  if (date && time) return `${date}, ${time}`
  return date || time
}

// ── TaskCard component ────────────────────────────────────────────

function TaskCard({ task, statusOptions, importanceOptions, onEdit, onDelete, onQuickComplete, language }) {
  const lx = CARD_TRANSLATIONS[language] ?? CARD_TRANSLATIONS.en

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [menuOpen])

  // statusOptions and importanceOptions arrive pre-translated from App.jsx
  const status     = statusOptions.find(s => s.value === task.status)         ?? statusOptions[0]
  const importance = importanceOptions.find(i => i.value === task.importance) ?? importanceOptions[2]
  const dateLabel  = formatDateRange(task.startDate, task.endDate, task.dueTime)

  function handleEditClick(e) {
    e.stopPropagation()
    setMenuOpen(false)
    onEdit(task)
  }

  function handleDeleteClick(e) {
    e.stopPropagation()
    setMenuOpen(false)
    if (window.confirm(lx.deleteConfirm)) {
      onDelete(task.id)
    }
  }

  function handleMenuToggle(e) {
    e.stopPropagation()
    setMenuOpen(v => !v)
  }

  return (
    <li
      className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}
      style={{ '--status-color': status.color }}
      onClick={() => onEdit(task)}
    >
      {/* Circle — quick-complete toggle */}
      <button
        className="check-btn"
        aria-label={lx.toggleComplete}
        onClick={e => { e.stopPropagation(); onQuickComplete(task.id) }}
      >
        {task.status === 'completed' && <Check size={12} strokeWidth={3} aria-hidden="true" />}
      </button>

      {/* Task body */}
      <div className="task-body">
        <span className="task-text">{task.text}</span>

        <div className="task-badges">
          <span className="badge" style={{
            background:  status.color + '1a',
            color:       status.color,
            borderColor: status.color + '44',
          }}>
            {status.label}
          </span>
          <span className="badge" style={{
            background:  importance.color + '1a',
            color:       importance.color,
            borderColor: importance.color + '44',
          }}>
            {importance.label}
          </span>
          {dateLabel && (
            <span className="badge deadline-badge">
              <Calendar size={11} strokeWidth={2} aria-hidden="true" />
              {dateLabel}
            </span>
          )}
        </div>

        {task.notes && <p className="notes-preview">{task.notes}</p>}
      </div>

      {/*
        Quick actions — two UX modes:
        Desktop (hover): individual icon buttons, hidden until card is hovered.
        Mobile (touch): single ⋯ button always visible, opens dropdown.
      */}
      <div className="task-actions" onClick={e => e.stopPropagation()}>

        {/* Desktop hover buttons */}
        <button
          className="task-action-btn task-action-edit"
          title={lx.editLabel}
          aria-label={lx.editLabel}
          onClick={handleEditClick}
        >
          <Pencil size={14} strokeWidth={2} aria-hidden="true" />
        </button>
        <button
          className="task-action-btn task-action-delete"
          title={lx.deleteLabel}
          aria-label={lx.deleteLabel}
          onClick={handleDeleteClick}
        >
          <Trash2 size={14} strokeWidth={2} aria-hidden="true" />
        </button>

        {/* Mobile three-dots menu */}
        <div className="task-menu-wrap" ref={menuRef}>
          <button
            className="task-menu-btn"
            title={lx.moreLabel}
            aria-label={lx.moreLabel}
            onClick={handleMenuToggle}
          >
            <MoreHorizontal size={16} strokeWidth={2} aria-hidden="true" />
          </button>

          {menuOpen && (
            <div className="task-menu" role="menu">
              <button
                className="task-menu-item"
                role="menuitem"
                onClick={handleEditClick}
              >
                <Pencil size={14} strokeWidth={2} aria-hidden="true" />
                {lx.editText}
              </button>
              <button
                className="task-menu-item task-menu-item--danger"
                role="menuitem"
                onClick={handleDeleteClick}
              >
                <Trash2 size={14} strokeWidth={2} aria-hidden="true" />
                {lx.deleteText}
              </button>
            </div>
          )}
        </div>

      </div>
    </li>
  )
}

export default TaskCard
