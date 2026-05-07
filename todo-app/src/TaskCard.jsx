import { useState, useEffect, useRef } from 'react'

// ── SVG icons — inline so no icon library is needed ───────────────

function IconEdit() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function IconDelete() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  )
}

function IconMore() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5"  cy="12" r="2"/>
      <circle cx="12" cy="12" r="2"/>
      <circle cx="19" cy="12" r="2"/>
    </svg>
  )
}

// ── Date formatting helpers (self-contained so TaskCard has no deps on App) ──

// Converts "2026-05-07" → "07/05/2026"  (Israeli dd/mm/yyyy format)
function formatDate(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-')
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

// The time input stores values as "HH:MM" (24-hour), which is already
// the correct Israeli format. Return it directly — no conversion needed.
function formatTime(str) {
  if (!str) return ''
  return str  // e.g. "14:00"
}

// Produces the full date label shown on task cards.
// Examples:
//   "07/05/2026"
//   "07/05/2026 – 17/05/2026"
//   "07/05/2026, 14:00"
//   "07/05/2026 – 17/05/2026, 14:00"
function formatDateRange(startDate, endDate, dueTime) {
  const start = formatDate(startDate)
  const end   = formatDate(endDate)
  const time  = formatTime(dueTime)
  const date  = (start && end && start !== end) ? `${start} – ${end}` : (start || end)
  if (date && time) return `${date}, ${time}`
  return date || time
}

// ── UI strings ────────────────────────────────────────────────────
const UI = {
  editLabel:   'Edit task',
  deleteLabel: 'Delete task',
  moreLabel:   'More actions',
  editText:    'Edit',
  deleteText:  'Delete',
  deleteConfirm: 'Delete this task?',
}

// ── TaskCard component ────────────────────────────────────────────

function TaskCard({ task, statusOptions, importanceOptions, onEdit, onDelete, onQuickComplete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close the ⋯ menu when the user clicks or taps anywhere outside it
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

  const status     = statusOptions.find(s => s.value === task.status)     ?? statusOptions[0]
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
    if (window.confirm(UI.deleteConfirm)) {
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
        aria-label="Toggle complete"
        onClick={e => { e.stopPropagation(); onQuickComplete(task.id) }}
      >
        {task.status === 'completed' ? '✓' : ''}
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
            <span className="badge deadline-badge">📅 {dateLabel}</span>
          )}
        </div>

        {task.notes && <p className="notes-preview">{task.notes}</p>}
      </div>

      {/*
        Quick actions — two separate UX patterns:
        - Desktop (hover capable): individual icon buttons, hidden until the card is hovered.
        - Mobile (touch): a single ⋯ button always visible, opens a small dropdown.
        CSS @media (hover: hover / none) switches between the two.
      */}
      <div className="task-actions" onClick={e => e.stopPropagation()}>

        {/* Desktop hover buttons */}
        <button
          className="task-action-btn task-action-edit"
          title={UI.editLabel}
          aria-label={UI.editLabel}
          onClick={handleEditClick}
        >
          <IconEdit />
        </button>
        <button
          className="task-action-btn task-action-delete"
          title={UI.deleteLabel}
          aria-label={UI.deleteLabel}
          onClick={handleDeleteClick}
        >
          <IconDelete />
        </button>

        {/* Mobile three-dots menu */}
        <div className="task-menu-wrap" ref={menuRef}>
          <button
            className="task-menu-btn"
            title={UI.moreLabel}
            aria-label={UI.moreLabel}
            onClick={handleMenuToggle}
          >
            <IconMore />
          </button>

          {menuOpen && (
            <div className="task-menu" role="menu">
              <button
                className="task-menu-item"
                role="menuitem"
                onClick={handleEditClick}
              >
                <IconEdit /> {UI.editText}
              </button>
              <button
                className="task-menu-item task-menu-item--danger"
                role="menuitem"
                onClick={handleDeleteClick}
              >
                <IconDelete /> {UI.deleteText}
              </button>
            </div>
          )}
        </div>

      </div>
    </li>
  )
}

export default TaskCard
