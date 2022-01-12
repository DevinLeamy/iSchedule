import React from "react";
import DayTimeSelector from "./DayTimeSelector/DayTimeSelector";
import "./Calendar.css"

type CalendarProps = {
  weekView?: boolean
};

const Calendar: React.FC<CalendarProps> = (props) => {

  return (
    <div className="calendar-main">
      <div className="calendar-topbar">
        <div className="change-week-btn change-week-left">
          {"<"}
        </div>
        <div className="week-header">
          July 8th - 14th
        </div>
        <div className="change-week-btn change-week-right">
          {">"}
        </div>
      </div>
      <div className="dts-container">
        <DayTimeSelector month={4} day={4} />
        <DayTimeSelector month={4} day={4} />
        <DayTimeSelector month={4} day={4} />
        <DayTimeSelector month={4} day={4} />
        <DayTimeSelector month={4} day={4} />
        <DayTimeSelector month={4} day={4} />
        <DayTimeSelector month={4} day={4} />
      </div>
    </div>
  );
}

export default Calendar;

