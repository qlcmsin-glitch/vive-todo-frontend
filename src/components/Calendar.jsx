import { WEEKDAYS, toDateKey } from '../utils/date';

export default function Calendar({
  year,
  month,
  selectedDate,
  today,
  datesWithTodos,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}) {
  const days = [];

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return (
    <section className="calendar">
      <header className="calendar__header">
        <button type="button" className="calendar__nav" onClick={onPrevMonth} aria-label="이전 달">
          ‹
        </button>
        <h2 className="calendar__title">
          {year}년 {month + 1}월
        </h2>
        <button type="button" className="calendar__nav" onClick={onNextMonth} aria-label="다음 달">
          ›
        </button>
      </header>

      <div className="calendar__weekdays">
        {WEEKDAYS.map((day, index) => (
          <span
            key={day}
            className={`calendar__weekday${index === 0 ? ' calendar__weekday--sun' : ''}${index === 6 ? ' calendar__weekday--sat' : ''}`}
          >
            {day}
          </span>
        ))}
      </div>

      <div className="calendar__grid">
        {days.map((date, index) => {
          if (!date) {
            return <span key={`empty-${index}`} className="calendar__cell calendar__cell--empty" />;
          }

          const dateKey = toDateKey(date);
          const isSelected =
            selectedDate.getFullYear() === date.getFullYear() &&
            selectedDate.getMonth() === date.getMonth() &&
            selectedDate.getDate() === date.getDate();
          const isToday =
            today.getFullYear() === date.getFullYear() &&
            today.getMonth() === date.getMonth() &&
            today.getDate() === date.getDate();
          const hasTodos = datesWithTodos.has(dateKey);
          const dayOfWeek = date.getDay();

          return (
            <button
              key={dateKey}
              type="button"
              className={[
                'calendar__cell',
                isSelected ? 'calendar__cell--selected' : '',
                isToday ? 'calendar__cell--today' : '',
                dayOfWeek === 0 ? 'calendar__cell--sun' : '',
                dayOfWeek === 6 ? 'calendar__cell--sat' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDate(date)}
            >
              <span className="calendar__day">{date.getDate()}</span>
              {hasTodos && <span className="calendar__dot" aria-label="할일 있음" />}
            </button>
          );
        })}
      </div>
    </section>
  );
}
