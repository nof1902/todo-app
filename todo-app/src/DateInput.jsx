import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './DateInput.css'
import { TRANSLATIONS } from './i18n/translations'

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

function DateInput({ value, onChange, className = '', language = 'en' }) {
  const t = TRANSLATIONS[language] ?? TRANSLATIONS.en
  const { monthsLong, monthsShort } = t.date

  const [viewMode, setViewMode] = useState('day')
  const [yearRangeStart, setYearRangeStart] = useState(null)

  function openYearView(currentYear) {
    setYearRangeStart(currentYear - 5)
    setViewMode('year')
  }

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
              title={`${start - 12}–${start - 1}`}
              onClick={() => setYearRangeStart(s => s - 12)}
            >«</button>

            <span className="dp-label">{start} – {start + 11}</span>

            <button
              type="button" className="dp-nav"
              title={`${start + 12}–${start + 23}`}
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
              title={t.date.prevYear} onClick={decreaseYear}
            >«</button>

            <button
              type="button" className="dp-label-btn"
              title={t.date.selectYear} onClick={() => openYearView(year)}
            >
              {year}
            </button>

            <button
              type="button" className="dp-nav"
              title={t.date.nextYear} onClick={increaseYear}
            >»</button>
          </div>

          <div className="dp-picker-body">
            {monthsShort.map((name, i) => (
              <button
                key={i}
                type="button"
                className={`dp-cell${month === i ? ' dp-cell--active' : ''}`}
                aria-label={monthsLong[i]}
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
    return (
      <div className="dp-header">
        <button
          type="button" className="dp-nav"
          title={t.date.prevYear} onClick={decreaseYear}
        >«</button>

        <button
          type="button" className="dp-nav"
          title={t.date.prevMonth}
          onClick={decreaseMonth} disabled={prevMonthButtonDisabled}
        >‹</button>

        <button
          type="button" className="dp-label-btn"
          title={t.date.selectMonthYear}
          onClick={() => setViewMode('month')}
        >
          {monthsLong[month]} {year}
        </button>

        <button
          type="button" className="dp-nav"
          title={t.date.nextMonth}
          onClick={increaseMonth} disabled={nextMonthButtonDisabled}
        >›</button>

        <button
          type="button" className="dp-nav"
          title={t.date.nextYear} onClick={increaseYear}
        >»</button>
      </div>
    )
  }

  return (
    <DatePicker
      selected={isoToDate(value)}
      onChange={date => onChange(dateToIso(date))}

      dateFormat="dd/MM/yyyy"
      placeholderText={t.date.placeholder}

      className={className}

      calendarClassName={viewMode !== 'day' ? 'app-cal is-picker-view' : 'app-cal'}

      renderCustomHeader={renderHeader}
      todayButton={t.date.today}

      portalId="dp-root"
      popperPlacement="bottom-start"

      onCalendarClose={() => { setViewMode('day'); setYearRangeStart(null) }}
    />
  )
}

export default DateInput
