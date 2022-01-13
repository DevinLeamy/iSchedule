import React, { useState } from "react";
import DayTimeSelector from "./DayTimeSelector/DayTimeSelector";
import { Date, DateTimeRange, Time } from "../../types/types";
import { getDate, getNextDate, formatDate } from "../../utilities/dates";
import "./Calendar.css"

type CalendarProps = {
  weekView?: boolean,
  days: number
};



const Calendar: React.FC<CalendarProps> = (props) => {
  const [weekStart, setWeekStart] = useState<Date>(getDate());
  const [dateTimeRanges, setDateTimeRanges] = useState<DateTimeRange[][]>(
    [...Array(props.days)].map(_ => [])
  );

  const onUpdateDateTimeRanges = (dayIndex: number, newDateTimeRanges: DateTimeRange[]) => {
    let updatedDateTimeRanges: DateTimeRange[][] = [...dateTimeRanges];

    updatedDateTimeRanges[dayIndex] = newDateTimeRanges;
    setDateTimeRanges(updatedDateTimeRanges);
  };
  

  return (
    <div className="calendar-main">
      <div className="calendar-topbar">
        <div 
          className="change-week-btn change-week-left"
          onClick={() => {
            let newWeekStart: Date = getNextDate(weekStart, -props.days);
            setWeekStart(newWeekStart);
          }}
        >
          {"<"}
        </div>
        <div className="week-header">
          {`${formatDate(weekStart, true)} 
          - 
          ${formatDate(getNextDate(weekStart, props.days - 1), true)}`
          }
        </div>
        <div 
          className="change-week-btn change-week-right"
          onClick={() => {
            let newWeekStart: Date = getNextDate(weekStart, props.days);
            setWeekStart(newWeekStart);
          }}
        >
          {">"}
        </div>
      </div>
      <div className="dts-container">
        <div className="c-times-display">
          <div className="c-times-header-spacer">

          </div>
          {[...Array(48)].map((_, i) => {
             let timeInMinutes = i * 15;
             let timeSlot: Time = { hour: Math.floor(timeInMinutes / 60), minute: timeInMinutes % 60 };
             if (i % 2 === 1) return <div className="c-times-display-time" />
            return (
              <div className="c-times-display-time">
                {`${timeSlot.hour}:${timeSlot.minute}`}
              </div>
            );
          })}
        </div>
        <div className='selector-container'>
          {[...Array(props.days)].map((_, i) => 
            <DayTimeSelector 
              key={i} 
              onChange={(newDateTimeRanges) => {
                onUpdateDateTimeRanges(i, newDateTimeRanges)
              }}
              date={getNextDate(weekStart, i)} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

Calendar.defaultProps = {
  days: 7
};

export default Calendar;

