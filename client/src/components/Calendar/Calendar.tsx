import React, { useState, useContext } from "react";
import { CalendarDate } from "../../types/types";
import { 
  getDateInDays, 
  getAbsYMD,
  serializeDate,
  deserializeDate,
  getCalendarDate,
} from "../../utilities";
import { usePersistedValue } from "../../hooks";
import CalendarHeader from "./CalendarHeader";
import CalendarDatesBar from "./CalendarDatesBar";
import { CalendarRangeSelector } from "./CalendarRangeSelector/CalendarRangeSelector";
import { DAYS_PER_WEEK, CELL_HEIGHT } from "../../constants";

import "./Calendar.css"
import { CreateEventContext } from "../contexts";

/*
FEATURES TO ADD:
- [ ] Monthly calendar
- [x] Vertical drag on weekly calendar
- [ ] Horizontal drag on weekly calendar
- [x] Delete blocks
- [ ] Squish blocks against top/bottom border
- [ ] Drag blocks between columns
- [x] Better way to extend blocks 
- [ ] Select all-day blocks

TODO:
- Code review
- Implement the backend
- Testing
*/

const TOTAL_ROWS: number = 24 * 4;

type CalendarProps = {
};

const Calendar: React.FC<CalendarProps> = ({
}) => {
  const { setTimeSlots } = useContext(CreateEventContext);

  const [weekStart, setWeekStart] = usePersistedValue<Date>(
    getAbsYMD(new Date()),
    "weekStart",
    { serialize: serializeDate, deserialize: deserializeDate }
  );

  const getCalendarDates = (weekStart: Date) : CalendarDate[] => {
    let calendarDates: CalendarDate[] = []

    for (let i = 0; i < DAYS_PER_WEEK; ++i) {
      let calendarDate = getCalendarDate(getDateInDays(i, weekStart))
      calendarDates.push(calendarDate)
    }

    return calendarDates
  }

  const calendarDates = getCalendarDates(weekStart);

  const gotoNextWeek = () : void => { setWeekStart(getDateInDays(DAYS_PER_WEEK, weekStart)) }
  const gotoPreviousWeek = () : void => { setWeekStart(getDateInDays(-DAYS_PER_WEEK, weekStart)) } 
  const clearCalendar = () : void => { setTimeSlots([]) }

  return (
    <div className="calendar-main">
      <CalendarHeader 
        onNext={gotoNextWeek}
        onPrevious={gotoPreviousWeek}
        onClearCalendar={clearCalendar}
      />
      <CalendarDatesBar 
        dates={calendarDates}
      />
      <CalendarRangeSelector
        calendarDates={calendarDates}
        rows={TOTAL_ROWS}
        cols={DAYS_PER_WEEK}
      />
   </div>
  );
}

export { Calendar }

