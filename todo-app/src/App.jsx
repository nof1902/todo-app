import { useState, useEffect } from 'react'
import './App.css'
import TaskModal from './TaskModal'
import FilterPanel from './FilterPanel'
import TaskCard from './TaskCard'
import Settings from './Settings'
import { useSettings, TRANSLATIONS } from './useSettings'

// ── Status and importance options (shared with TaskModal + TaskCard) ──
export const STATUS_OPTIONS = [
  { value: 'not-started',    label: 'Not Started',    color: '#6b7280' },
  { value: 'in-progress',    label: 'In Progress',    color: '#3b82f6' },
  { value: 'almost-done',    label: 'Almost Done',    color: '#8b5cf6' },
  { value: 'partially-done', label: 'Partially Done', color: '#f59e0b' },
  { value: 'completed',      label: 'Completed',      color: '#10b981' },
]

export const IMPORTANCE_OPTIONS = [
  { value: 'critical',  label: 'Critical',  color: '#ef4444' },
  { value: 'important', label: 'Important', color: '#f97316' },
  { value: 'medium',    label: 'Medium',    color: '#3b82f6' },
  { value: 'low',       label: 'Low',       color: '#6b7280' },
  { value: 'optional',  label: 'Optional',  color: '#9ca3af' },
]

// ── Filter default state ──────────────────────────────────────────
const FILTERS_DEFAULT = {
  search:     '',
  status:     'all',
  importance: 'all',
  date:       'all',
  customFrom: '',
  customTo:   '',
}

// ── Default shape for a new task ─────────────────────────────────
const TASK_SHAPE = {
  status:     'not-started',
  importance: 'medium',
  startDate:  '',
  endDate:    '',
  dueTime:    '',
  notes:      '',
}

// ── LocalStorage helpers ───────────────────────────────────────────

function loadTasks() {
  try {
    const raw = localStorage.getItem('tasks')
    if (!raw) return []
    return JSON.parse(raw).map(t => {
      const status = t.status ?? (t.completed ? 'completed' : 'not-started')
      const task = { ...TASK_SHAPE, ...t, status }
      // Migrate old single dueDate → endDate
      if (t.dueDate && !t.endDate) task.endDate = t.dueDate
      delete task.dueDate
      return task
    })
  } catch {
    return []
  }
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

// ── Date filter logic ──────────────────────────────────────────────

function taskMatchesDateFilter(task, dateFilter, customFrom, customTo) {
  if (dateFilter === 'all') return true

  function parseDate(str) {
    if (!str) return null
    const [y, m, d] = str.split('-')
    return new Date(+y, +m - 1, +d)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (dateFilter === 'overdue') {
    if (!task.endDate || task.status === 'completed') return false
    return parseDate(task.endDate) < today
  }

  const taskStart = parseDate(task.startDate)
  const taskEnd   = parseDate(task.endDate)
  if (!taskStart && !taskEnd) return false

  const effStart = taskStart || taskEnd
  const effEnd   = taskEnd   || taskStart

  if (dateFilter === 'today') {
    return effStart <= today && effEnd >= today
  }

  if (dateFilter === 'this-week') {
    const day  = today.getDay()
    const diff = day === 0 ? -6 : 1 - day
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() + diff)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return effStart <= weekEnd && effEnd >= weekStart
  }

  if (dateFilter === 'custom') {
    if (!customFrom || !customTo) return true
    const rangeStart = parseDate(customFrom)
    const rangeEnd   = parseDate(customTo)
    return effStart <= rangeEnd && effEnd >= rangeStart
  }

  return true
}

// ── App component ──────────────────────────────────────────────────

function App() {
  const { settings, updateSetting } = useSettings()

  const [tasks, setTasks]             = useState(loadTasks)
  const [filters, setFilters]         = useState(FILTERS_DEFAULT)
  const [newText, setNewText]         = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => { saveTasks(tasks) }, [tasks])

  // Active translation set based on current language setting
  const UI = TRANSLATIONS[settings.language] ?? TRANSLATIONS.en

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function handleClearFilters() {
    setFilters(FILTERS_DEFAULT)
  }

  function handleAddTask(e) {
    e.preventDefault()
    const text = newText.trim()
    if (!text) return
    setTasks(prev => [
      ...prev,
      {
        id: Date.now(),
        createdAt: Date.now(),
        text,
        ...TASK_SHAPE,
        status:     settings.defaultStatus,
        importance: settings.defaultImportance,
      },
    ])
    setNewText('')
  }

  function handleSaveTask(updated) {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
    setEditingTask(null)
  }

  function handleDeleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
    setEditingTask(null)
  }

  function handleQuickComplete(id) {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, status: t.status === 'completed' ? 'not-started' : 'completed' }
        : t
    ))
  }

  function handleClearCompleted() {
    setTasks(prev => prev.filter(t => t.status !== 'completed'))
  }

  // Apply all active filters simultaneously
  const filteredTasks = tasks.filter(task => {
    if (!settings.showCompleted && task.status === 'completed') return false
    if (filters.status !== 'all' && task.status !== filters.status) return false
    if (filters.importance !== 'all' && task.importance !== filters.importance) return false
    if (filters.search.trim()) {
      if (!task.text.toLowerCase().includes(filters.search.trim().toLowerCase())) return false
    }
    if (!taskMatchesDateFilter(task, filters.date, filters.customFrom, filters.customTo)) return false
    return true
  })

  const activeFilterCount = [
    filters.status     !== 'all',
    filters.importance !== 'all',
    filters.date       !== 'all',
    filters.search.trim() !== '',
  ].filter(Boolean).length

  const activeCount    = tasks.filter(t => t.status !== 'completed').length
  const completedCount = tasks.filter(t => t.status === 'completed').length

  return (
    <div className="app">
      <div className="container">

        <header className="header">
          <div className="header-icon">✓</div>
          <div className="header-text">
            <h1 className="title">{UI.appTitle}</h1>
            <p className="subtitle">{UI.appSubtitle}</p>
          </div>
          <button
            type="button"
            className="settings-btn"
            onClick={() => setSettingsOpen(true)}
            aria-label={UI.settingsLabel}
            title={UI.settingsLabel}
          >
            ⚙
          </button>
        </header>

        {/* Quick-add form */}
        <form className="add-task-card" onSubmit={handleAddTask}>
          <input
            type="text"
            className="task-input"
            placeholder={UI.addPlaceholder}
            value={newText}
            onChange={e => setNewText(e.target.value)}
          />
          <button className="add-btn" type="submit">{UI.addButton}</button>
        </form>

        {/* Filter panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
          activeCount={activeFilterCount}
          statusOptions={STATUS_OPTIONS}
          importanceOptions={IMPORTANCE_OPTIONS}
          language={settings.language}
        />

        {/* Task list */}
        {filteredTasks.length > 0 ? (
          <ul className="task-list">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                statusOptions={STATUS_OPTIONS}
                importanceOptions={IMPORTANCE_OPTIONS}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onQuickComplete={handleQuickComplete}
              />
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              {activeFilterCount > 0 ? UI.emptyNoMatchIcon : UI.emptyNoTasksIcon}
            </div>
            <p className="empty-title">
              {activeFilterCount > 0 ? UI.emptyNoMatch : UI.emptyNoTasks}
            </p>
            <p className="empty-text">
              {activeFilterCount > 0 ? UI.emptyNoMatchSub : UI.emptyNoTasksSub}
            </p>
          </div>
        )}

        <div className="footer">
          <span className="task-count">{UI.remaining(activeCount)}</span>
          {completedCount > 0 && (
            <button className="clear-btn" onClick={handleClearCompleted}>
              {UI.clearCompleted(completedCount)}
            </button>
          )}
        </div>

      </div>

      {editingTask && (
        <TaskModal
          task={editingTask}
          statusOptions={STATUS_OPTIONS}
          importanceOptions={IMPORTANCE_OPTIONS}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {settingsOpen && (
        <Settings
          settings={settings}
          onUpdate={updateSetting}
          onClose={() => setSettingsOpen(false)}
          statusOptions={STATUS_OPTIONS}
          importanceOptions={IMPORTANCE_OPTIONS}
        />
      )}
    </div>
  )
}

export default App
