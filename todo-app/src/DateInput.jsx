import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './DateInput.css'

const MONTHS_LONG = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
]

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec',
]

// ── ISO ↔ Date conversion ──────────────────────────────────────────

function isoToDate(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-')
  return new Date(+y, +m - 1, +d)
}

function dateToIso(date) {
  if (!date) return ''
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

// ── DateInput component ────────────────────────────────────────────
//
// Three-level navigation: Day ← Month ← Year
//
//   Day view:   « ‹ [May 2026 ▾] › »  →  click label → Month view
//   Month view: «   [2026 ▾]     »    →  click label → Year view
//   Year view:  «  [2020–2031]   »    →  click year  → Month view
//                                        click month → Day view

function DateInput({ value, onChange, className = '' }) {
  // 'day' | 'month' | 'year'
  const [viewMode, setViewMode] = useState('day')

  // First year shown in the 12-year grid (null = not yet calculated)
  const [yearRangeStart, setYearRangeStart] = useState(null)

  // Open year view centred on the given year
  function openYearView(currentYear) {
    setYearRangeStart(currentYear - 5)
    setViewMode('year')
  }

  // renderHeader is called by react-datepicker on every header render.
  // It captures viewMode, yearRangeStart, and setters via closure.
  function renderHeader({
    date,
    decreaseMonth,  increaseMonth,
    decreaseYear,   increaseYear,
    prevMonthButtonDisabled, nextMonthButtonDisabled,
    changeMonth,    changeYear,
  }) {
    const year  = date.getFullYear()
    const month = date.getMonth()

    // ── Year view ────────────────────────────────────────────────
    if (viewMode === 'year') {
      const start = yearRangeStart ?? (year - 5)
      const years = Array.from({ length: 12 }, (_, i) => start + i)

      return (
        <>
          <div className="dp-header">
            <button
              type="button" className="dp-nav"
              title={`Show ${start - 12}–${start - 1}`}
              onClick={() => setYearRangeStart(s => s - 12)}
            >«</button>

            <span className="dp-label">{start} – {start + 11}</span>

            <button
              type="button" className="dp-nav"
              title={`Show ${start + 12}–${start + 23}`}
              onClick={() => setYearRangeStart(s => s + 12)}
            >»</button>
          </div>

          <div className="dp-picker-body">
            {years.map(y => (
              <button
                key={y}
                type="button"
                className={`dp-cell${y === year ? ' dp-cell--active' : ''}`}
                aria-pressed={y === year}
                onClick={() => { changeYear(y); setViewMode('month') }}
              >
                {y}
              </button>
            ))}
          </div>
        </>
      )
    }

    // ── Month view ───────────────────────────────────────────────
    if (viewMode === 'month') {
      return (
        <>
          <div className="dp-header">
            <button
              type="button" className="dp-nav"
              title="Previous year" onClick={decreaseYear}
            >«</button>

            {/* Clickable year: drills into year-range picker */}
            <button
              type="button" className="dp-label-btn"
              title="Select year" onClick={() => openYearView(year)}
            >
              {year}
            </button>

            <button
              type="button" className="dp-nav"
              title="Next year" onClick={increaseYear}
            >»</button>
          </div>

          <div className="dp-picker-body">
            {MONTHS_SHORT.map((name, i) => (
              <button
                key={i}
                type="button"
                className={`dp-cell${month === i ? ' dp-cell--active' : ''}`}
                aria-label={MONTHS_LONG[i]}
                aria-pressed={month === i}
                onClick={() => { changeMonth(i); setViewMode('day') }}
              >
                {name}
              </button>
            ))}
          </div>
        </>
      )
    }

    // ── Day view (default) ───────────────────────────────────────
    // Clickable "May 2026" label opens month view.
    return (
      <div className="dp-header">
        <button
          type="button" className="dp-nav"
          title="Previous year" onClick={decreaseYear}
        >«</button>

        <button
          type="button" className="dp-nav"
          title="Previous month"
          onClick={decreaseMonth} disabled={prevMonthButtonDisabled}
        >‹</button>

        <button
          type="button" className="dp-label-btn"
          title="Select month and year"
          onClick={() => setViewMode('month')}
        >
          {MONTHS_LONG[month]} {year}
        </button>

        <button
          type="button" className="dp-nav"
          title="Next month"
          onClick={increaseMonth} disabled={nextMonthButtonDisabled}
        >›</button>

        <button
          type="button" className="dp-nav"
          title="Next year" onClick={increaseYear}
        >»</button>
      </div>
    )
  }

  return (
    <DatePicker
      selected={isoToDate(value)}
      onChange={date => onChange(dateToIso(date))}

      dateFormat="dd/MM/yyyy"
      placeholderText="dd/mm/yyyy"

      className={className}

      // 'is-picker-view' hides the day grid and Today button when
      // the month or year picker is active.
      calendarClassName={viewMode !== 'day' ? 'app-cal is-picker-view' : 'app-cal'}

      renderCustomHeader={renderHeader}
      todayButton="Today"

      // Portal: render outside the modal DOM tree so overflow:hidden
      // and CSS transform animations cannot clip the popup.
      portalId="dp-root"
      popperPlacement="bottom-start"

      // Always return to day view when the picker closes.
      onCalendarClose={() => { setViewMode('day'); setYearRangeStart(null) }}
    />
  )
}

export default DateInput
