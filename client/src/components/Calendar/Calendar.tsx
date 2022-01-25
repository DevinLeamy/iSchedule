import React, { useState } from "react";
import { DateRange, AbsTime } from "../../types/types";
import { 
  getDateInDays, 
  dateInRange, 
  daysBetween,
  getAbsYMD,
  getEndOfTheDay,
  minToAbsTime,
  getAbsMinutesFromDate
} from "../../utilities/dates";
import { RangeBlockBox } from "./RangeBox/RangeBox";
import CalendarHeader from "./CalendarHeader";
import CalendarDatesBar from "./CalendarDatesBar";
import CalendarRangeSelector from "./CalendarRangeSelector";
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
- [ ] Vertical drag on weekly calendar
- [ ] Horizontal drag on weekly calendar
- [x] Delete blocks
- [ ] Squish blocks against top/bottom border
- [ ] Drag blocks between columns
- [ ] Better way to extend blocks 
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
    return dateRanges
      .map(dateRange => getRangeBoxFromDateRange(dateRange))
      .filter(dateRange => dateRange !== undefined) as RangeBlockBox[];
  }

  const getRangeBoxFromDateRange = (dateRange: DateRange) : RangeBlockBox | undefined => {
    let startDate = getDateRangeStartDate(dateRange) 

    if (weekContainsDate(startDate)) {
      return {
        bRow: Math.round(getAbsMinutesFromDate(dateRange.startDate) / CELL_HEIGHT),
        tRow: Math.round(getAbsMinutesFromDate(dateRange.endDate) / CELL_HEIGHT),
        col: daysBetween(startDate, weekStart) 
      }
 
    }
   return undefined;
  }

  const [weekStart, setWeekStart] = useState<Date>(
    getAbsYMD(new Date())
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

  const gotoNextWeek = () : void => {
    setWeekStart(getDateInDays(TOTAL_COLS, weekStart))
  }

  const gotoPreviousWeek = () : void => {
    setWeekStart(getDateInDays(-TOTAL_COLS, weekStart))
  } 

  return (
    <div className="calendar-main">
      <CalendarHeader 
        onNextWeek={gotoNextWeek}
        onPreviousWeek={gotoPreviousWeek}
      />
      <CalendarDatesBar 
        startDate={weekStart} 
        totalDays={TOTAL_COLS}
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

const getDateRangeStartDate = (dateRange: DateRange) : Date => {
  return dateRange.startDate; 
}

const getDateRangeEndDate = (dateRange: DateRange) : Date => {
  return dateRange.endDate;
}

const getWeekEnd = (weekStart: Date) : Date => {
  return getEndOfTheDay(getDateInDays(TOTAL_COLS - 1, weekStart));
}




export default Calendar;

