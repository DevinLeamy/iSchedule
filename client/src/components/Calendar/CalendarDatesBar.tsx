import React from "react";

import { getSDate, getDateFromCalendarDate } from "../../utilities/dates";
import { CalendarDate } from "../../types";
import { List } from "../common";

type CalendarDatesBarProps = {
  dates: CalendarDate[]
};

const CalendarDatesBar : React.FC<CalendarDatesBarProps> = ({
  dates
}) => {
  const mapCalendarDate = (calendarDate: CalendarDate) : React.ReactNode => {
    const sdate = getSDate(getDateFromCalendarDate(calendarDate))

    return (
      <div key={sdate.day} className="calendar-day">
        <div className="cd-month">{sdate.month.slice(0, 3)}</div>
        <div className="cd-day">{sdate.day}</div>
        <div className="cd-weekday">{sdate.weekday}</div>
      </div>
    )
  }

  const mapCalendarDateToKey = (calendarDate: CalendarDate) : string => {
    return getDateFromCalendarDate(calendarDate).toString()
  }

  return (
    <div className="calendar-days-main">
      <div className="calendar-dates-spacer" />
      <div className="calendar-days">
        {/* {dates.map(mapCalendarDate)} */}
        <List
          listKeyMap={mapCalendarDateToKey} 
          listItemMap={mapCalendarDate}
          items={dates}
          horizontal={true}
        />
      </div>
    </div>
  );
}

export default CalendarDatesBar;
