import React, { ReactNode, useState, useContext } from "react";
import classNames from "classnames";

import { Time, RangeBlock, DateRange, MemberRangeBlock, CalendarDate, RangeBlockBox, Event, MemberDateRange } from "../../../types";
import RangeBox from "../../Calendar/RangeBox/RangeBox";
import { 
  getCalendarDate, 
  getDateRangesInRange, 
  getDateFromCalendarDate, 
  getSDate,
  getAbsMinutesFromDate,
  deepEqual,
  dateInRange
} from "../../../utilities";
import { TimesList, GridCellsList, List } from "../../common";
import { EventContext } from "../../contexts";
import { EventRangeSelector } from "../EventRangeSelector/EventRangeSelector";
import { CELLS_PER_DAY, DAYS_PER_WEEK, MINUTES_PER_CELL } from "../../../constants";
import CalendarHeader from "../../Calendar/CalendarHeader";
import CalendarDatesBar from "../../Calendar/CalendarDatesBar";

import "./EventCalendar.css"

interface EventCalendarProps {
}

const EventCalendar: React.FC<EventCalendarProps> = ({
}) => {
  const { event } = useContext(EventContext);

  if (event === undefined)
    return null;
  
  const calendarDates = getEventCalendarDates(event);
  const calendarColumns = Math.min(DAYS_PER_WEEK, calendarDates.length)
  const [startDateIndex, setStartDateIndex] = useState<number>(0);

  if (calendarDates.length === 0)
    return <h1>Loading...</h1>;

  const gotoNextWeek = () : void => { 
    setStartDateIndex(Math.min(calendarDates.length - calendarColumns, startDateIndex + DAYS_PER_WEEK)) 
  }
  const gotoPreviousWeek = () : void => { 
    setStartDateIndex(Math.max(0, startDateIndex - DAYS_PER_WEEK)) 
  }

  return (
    <div className="calendar-main">
      <CalendarHeader 
        onNext={gotoNextWeek}
        onPrevious={gotoPreviousWeek}
      />
      <CalendarDatesBar 
        dates={calendarDates.slice(startDateIndex, startDateIndex + calendarColumns)}
      />
      <EventRangeSelector
        calendarDates={calendarDates.slice(startDateIndex, startDateIndex + calendarColumns)}
        // rangeBoxes={rangeBoxes}
        // onRangeBoxesChange={() => {}}
        rows={CELLS_PER_DAY}
        cols={calendarColumns}
      />
    </div>
  )
}

 // All of the dates that an events fall on
 const getEventCalendarDates = (event: Event) : CalendarDate[] => {
  let dates: CalendarDate[] = []
  
  for (let timeslot of event.timeSlots) {
    if (!dates.includes(timeslot.date))
      dates.push(timeslot.date)
  }
  return dates;
}

export { EventCalendar };
