import { useState, useEffect } from 'react'
import { Check, Settings as SettingsIcon, ClipboardList, SearchX } from 'lucide-react'
import './App.css'
import TaskModal from './TaskModal'
import FilterPanel from './FilterPanel'
import TaskCard from './TaskCard'
import Settings from './Settings'
import { useSettings } from './useSettings'
import { STATUS_OPTIONS, IMPORTANCE_OPTIONS, TRANSLATIONS, getLabel } from './i18n/translations'

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

  const [tasks, setTasks]               = useState(loadTasks)
  const [filters, setFilters]           = useState(FILTERS_DEFAULT)
  const [newText, setNewText]           = useState('')
  const [editingTask, setEditingTask]   = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => { saveTasks(tasks) }, [tasks])

  // Active language set and pre-translated option arrays, recomputed on language change
  const lang            = settings.language
  const t               = TRANSLATIONS[lang] ?? TRANSLATIONS.en
  const statusOptions   = STATUS_OPTIONS.map(o => ({ ...o, label: getLabel(o, lang) }))
  const importanceOptions = IMPORTANCE_OPTIONS.map(o => ({ ...o, label: getLabel(o, lang) }))

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
    setTasks(prev => prev.map(task => task.id === updated.id ? updated : task))
    setEditingTask(null)
  }

  function handleDeleteTask(id) {
    setTasks(prev => prev.filter(task => task.id !== id))
    setEditingTask(null)
  }

  function handleQuickComplete(id) {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'completed' ? 'not-started' : 'completed' }
        : task
    ))
  }

  function handleClearCompleted() {
    setTasks(prev => prev.filter(task => task.status !== 'completed'))
  }

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

  const activeCount    = tasks.filter(task => task.status !== 'completed').length
  const completedCount = tasks.filter(task => task.status === 'completed').length

  return (
    <div className="app">
      <div className="container">

        <header className="header">
          <div className="header-icon"><Check size={22} strokeWidth={3} aria-hidden="true" /></div>
          <div className="header-text">
            <h1 className="title">{t.app.title}</h1>
            <p className="subtitle">{t.app.subtitle}</p>
          </div>
          <button
            type="button"
            className="settings-btn"
            onClick={() => setSettingsOpen(true)}
            aria-label={t.settings.title}
            title={t.settings.title}
          >
            <SettingsIcon size={18} aria-hidden="true" />
          </button>
        </header>

        <form className="add-task-card" onSubmit={handleAddTask}>
          <input
            type="text"
            className="task-input"
            placeholder={t.app.addPlaceholder}
            value={newText}
            onChange={e => setNewText(e.target.value)}
          />
          <button className="add-btn" type="submit">{t.app.addButton}</button>
        </form>

        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
          activeCount={activeFilterCount}
          statusOptions={statusOptions}
          importanceOptions={importanceOptions}
          language={lang}
        />

        {filteredTasks.length > 0 ? (
          <ul className="task-list">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                statusOptions={statusOptions}
                importanceOptions={importanceOptions}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onQuickComplete={handleQuickComplete}
                language={lang}
              />
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              {activeFilterCount > 0
                ? <SearchX size={44} strokeWidth={1.5} aria-hidden="true" />
                : <ClipboardList size={44} strokeWidth={1.5} aria-hidden="true" />}
            </div>
            <p className="empty-title">
              {activeFilterCount > 0 ? t.app.emptyNoMatch : t.app.emptyNoTasks}
            </p>
            <p className="empty-text">
              {activeFilterCount > 0 ? t.app.emptyNoMatchSub : t.app.emptyNoTasksSub}
            </p>
          </div>
        )}

        <div className="footer">
          <span className="task-count">{t.app.remaining(activeCount)}</span>
          {completedCount > 0 && (
            <button className="clear-btn" onClick={handleClearCompleted}>
              {t.app.clearCompleted(completedCount)}
            </button>
          )}
        </div>

      </div>

      {editingTask && (
        <TaskModal
          task={editingTask}
          statusOptions={statusOptions}
          importanceOptions={importanceOptions}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => setEditingTask(null)}
          language={lang}
        />
      )}

      {settingsOpen && (
        <Settings
          settings={settings}
          onUpdate={updateSetting}
          onClose={() => setSettingsOpen(false)}
          statusOptions={statusOptions}
          importanceOptions={importanceOptions}
        />
      )}
    </div>
  )
}

export default App
