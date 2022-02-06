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
  // const weekContainsDate = (date: Date) : boolean => {
  //   return dateInRange(date, weekStart, getWeekEnd(weekStart));
  // }

  // const getRangeBoxesFromDateRanges = (dateRanges: DateRange[]) : RangeBlockBox[] => {
  //   let dateRangesInRange = getDateRangesInRange(weekStart, getWeekEnd(weekStart), dateRanges)
  //   return dateRangesInRange.map(dateRange => getRangeBoxFromDateRange(dateRange))
  // }

  // const getRangeBoxFromDateRange = (dateRange: DateRange) : RangeBlockBox => {
  //   return {
  //     bRow: Math.round(getAbsMinutesFromDate(dateRange.startDate) / CELL_HEIGHT),
  //     tRow: Math.round(getAbsMinutesFromDate(dateRange.endDate) / CELL_HEIGHT),
  //     col: daysBetween(dateRange.startDate, weekStart) 
  //   }
  // }

  const [weekStart, setWeekStart] = usePersistedValue<Date>(
    getAbsYMD(new Date()),
    "weekStart",
    { serialize: serializeDate, deserialize: deserializeDate }
  );

  const getCalendarDates = (weekStart: Date) : CalendarDate[] => {
    let calendarDates = []

    for (let i = 0; i < DAYS_PER_WEEK; ++i) {
      let calendarDate = getCalendarDate(getDateInDays(0, weekStart))
      calendarDates.push(calendarDate)
    }

    return calendarDates
  }

  const calendarDates = getCalendarDates(weekStart);

  
  // const rangeBoxes = getRangeBoxesFromDateRanges(dateRanges)

  // const updateDateRanges = (updatedRangeBoxes: RangeBlockBox[]) : void => {
  //   const updatedDateRanges: DateRange[] = [] 
    
  //   // Keep dates that lie outside of the current week, discard the rest.
  //   for (let dateRange of dateRanges) {
  //     const startDate = getDateRangeStartDate(dateRange)

  //     if (!weekContainsDate(startDate)) 
  //       updatedDateRanges.push({...dateRange})
  //   }

  //   for (let rangeBox of updatedRangeBoxes) {
  //     let startRow = rangeBox.bRow;
  //     let endRow = rangeBox.tRow;

  //     let dayOffset = rangeBox.col;
  //     let date = getDateInDays(dayOffset, weekStart);

  //     let startTime: AbsTime = minToAbsTime(startRow * CELL_MINUTES)
  //     let startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startTime.hour, startTime.minute)

  //     let endTime: AbsTime = minToAbsTime(endRow * CELL_MINUTES)
  //     let endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endTime.hour, endTime.minute)

  //     updatedDateRanges.push({ startDate, endDate, timezone })
  //   }

  //   onDateRangeChange(updatedDateRanges);
  // }

  // const mapRangeBox = (
  //   rangeBox: RangeBlockBox, 
  //   id: number,
  //   onChange: (id: number, row: number, col: number, heightInCells: number) => void, 
  //   onDelete: (id: number) => void
  // ) : React.ReactNode => {
  //   return (
  //     <RangeBox
  //       id={id}
  //       box={{...rangeBox}}
  //       cellWidth={130}
  //       cellHeight={15}
  //       onChange={onChange}
  //       onDelete={onDelete}
  //     />
  //   );
  // }

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
        dates={getCalendarDates(weekStart)}
      />
      <CalendarRangeSelector
        calendarDates={calendarDates}
        // rangeBoxes={rangeBoxes}
        // onRangeBoxesChange={updateDateRanges}
        // rangeBoxMap={mapRangeBox}
        rows={TOTAL_ROWS}
        cols={DAYS_PER_WEEK}
      />
   </div>
  );
}

// const getCalendarDates = (startDate: Date, totalDays: number) : CalendarDate[] => {
//   let calendarDates: CalendarDate[] = []

//   for (let i = 0; i < totalDays; ++i) {
//     let day = new Date(startDate.getTime())
//     day.setDate(day.getDate() + i);

//     calendarDates.push(getCalendarDate(day))
//   }

//   return calendarDates;
// }

// const getDateRangeStartDate = (dateRange: DateRange) : Date => {
//   return dateRange.startDate; 
// }

// const getDateRangeEndDate = (dateRange: DateRange) : Date => {
//   return dateRange.endDate;
// }

// const getWeekEnd = (weekStart: Date) : Date => {
//   return getEndOfTheDay(getDateInDays(TOTAL_COLS - 1, weekStart));
// }

export { Calendar }

