import React, { useState } from "react";
import { DateRange, AbsTime, RangeBlockBox, CalendarDate } from "../../types/types";
import { 
  getDateInDays, 
  dateInRange, 
  daysBetween,
  getAbsYMD,
  getEndOfTheDay,
  minToAbsTime,
  getAbsMinutesFromDate,
  serializeDate,
  deserializeDate,
  getCalendarDate,
  getDateRangesInRange
} from "../../utilities";
import { usePersistedValue } from "../../hooks";
import CalendarHeader from "./CalendarHeader";
import CalendarDatesBar from "./CalendarDatesBar";
import { CalendarRangeSelector } from "./CalendarRangeSelector/CalendarRangeSelector";
import { DAYS_PER_WEEK } from "../../constants";

import "./Calendar.css"

type CalendarProps = {
  dateRanges: DateRange[],
  timezone: string, 
  onDateRangeChange: (newRanges: DateRange[]) => void
};

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
const TOTAL_COLS: number = 7;
const CELL_HEIGHT: number = 15;
const CELL_MINUTES: number = 15;

const Calendar: React.FC<CalendarProps> = ({
  timezone,
  dateRanges,
  onDateRangeChange
}) => {
  const weekContainsDate = (date: Date) : boolean => {
    return dateInRange(date, weekStart, getWeekEnd(weekStart));
  }

  const getRangeBoxesFromDateRanges = (dateRanges: DateRange[]) : RangeBlockBox[] => {
    let dateRangesInRange = getDateRangesInRange(weekStart, getWeekEnd(weekStart), dateRanges)
    return dateRangesInRange.map(dateRange => getRangeBoxFromDateRange(dateRange))
  }

  const getRangeBoxFromDateRange = (dateRange: DateRange) : RangeBlockBox => {
    return {
      bRow: Math.round(getAbsMinutesFromDate(dateRange.startDate) / CELL_HEIGHT),
      tRow: Math.round(getAbsMinutesFromDate(dateRange.endDate) / CELL_HEIGHT),
      col: daysBetween(dateRange.startDate, weekStart) 
    }
  }

  const [weekStart, setWeekStart] = usePersistedValue<Date>(
    getAbsYMD(new Date()),
    "weekStart",
    { serialize: serializeDate, deserialize: deserializeDate }
  );
  const rangeBoxes = getRangeBoxesFromDateRanges(dateRanges)

  const updateDateRanges = (updatedRangeBoxes: RangeBlockBox[]) : void => {
    const updatedDateRanges: DateRange[] = [] 
    
    // Keep dates that lie outside of the current week, discard the rest.
    for (let dateRange of dateRanges) {
      const startDate = getDateRangeStartDate(dateRange)

      if (!weekContainsDate(startDate)) 
        updatedDateRanges.push({...dateRange})
    }

    for (let rangeBox of updatedRangeBoxes) {
      let startRow = rangeBox.bRow;
      let endRow = rangeBox.tRow;

      let dayOffset = rangeBox.col;
      let date = getDateInDays(dayOffset, weekStart);

      let startTime: AbsTime = minToAbsTime(startRow * CELL_MINUTES)
      let startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startTime.hour, startTime.minute)

      let endTime: AbsTime = minToAbsTime(endRow * CELL_MINUTES)
      let endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endTime.hour, endTime.minute)

      updatedDateRanges.push({ startDate, endDate, timezone })
    }

    onDateRangeChange(updatedDateRanges);
  }

  const gotoNextWeek = () : void => { setWeekStart(getDateInDays(TOTAL_COLS, weekStart)) }
  const gotoPreviousWeek = () : void => { setWeekStart(getDateInDays(-TOTAL_COLS, weekStart)) } 
  const clearCalendar = () : void => { onDateRangeChange([]) }

  return (
    <div className="calendar-main">
      <CalendarHeader 
        onNext={gotoNextWeek}
        onPrevious={gotoPreviousWeek}
        onClearCalendar={clearCalendar}
      />
      <CalendarDatesBar 
        dates={getCalendarDates(weekStart, DAYS_PER_WEEK)}
      />
      <CalendarRangeSelector
        rangeBoxes={rangeBoxes}
        onRangeBoxesChange={updateDateRanges}
        rows={TOTAL_ROWS}
        cols={TOTAL_COLS}
      />
   </div>
  );
}

const getCalendarDates = (startDate: Date, totalDays: number) : CalendarDate[] => {
  let calendarDates: CalendarDate[] = []

  for (let i = 0; i < totalDays; ++i) {
    let day = new Date(startDate.getTime())
    day.setDate(day.getDate() + i);

    calendarDates.push(getCalendarDate(day))
  }

  return calendarDates;
}

const getDateRangeStartDate = (dateRange: DateRange) : Date => {
  return dateRange.startDate; 
}

const getDateRangeEndDate = (dateRange: DateRange) : Date => {
  return dateRange.endDate;
}

const getWeekEnd = (weekStart: Date) : Date => {
  return getEndOfTheDay(getDateInDays(TOTAL_COLS - 1, weekStart));
}

export { Calendar }

