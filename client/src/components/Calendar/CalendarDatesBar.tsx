import React from "react";
import { getSDate } from "../../utilities/dates";

type CalendarDatesBarProps = {
  startDate: Date,
  totalDays: number
};

const CalendarDatesBar : React.FC<CalendarDatesBarProps> = ({
  startDate,
  totalDays
}) => {
  const renderCalendarDay = (date: Date) : React.ReactNode => {
    const sdate = getSDate(date)

    return (
      <div key={sdate.day} className="calendar-day">
        <div className="cd-month">{sdate.month.slice(0, 3)}</div>
        <div className="cd-day">{sdate.day}</div>
        <div className="cd-weekday">{sdate.weekday}</div>
      </div>
    )
  }

  return (
    <div className="calendar-days-main">
      <div className="calendar-dates-spacer" />
      <div className="calendar-days">
        {[...Array(totalDays)].map((_, dayOffset) => {
          let day = new Date(startDate.getTime())
          day.setDate(day.getDate() + dayOffset)

          return renderCalendarDay(day);
        })}
      </div>
    </div>
  );
}

export default CalendarDatesBar;
