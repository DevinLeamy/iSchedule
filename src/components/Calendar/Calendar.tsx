import React, { useState } from "react";
import { DateRange } from "../../types/types";
import { getDateInDays, dateInRange } from "../../utilities/dates";
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
- [ ] Vertical drag on weekly calendar
- [ ] Vertical + Horizontal drag on weekly calendar
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
  const getRangeBoxesFromDateRanges = (dateRanges: DateRange[]) : RangeBlockBox[] => {
    return dateRanges
      .map(dateRange => getRangeBoxFromDateRange(dateRange))
      .filter(dateRange => dateRange !== undefined) as RangeBlockBox[];
  }

  const getRangeBoxFromDateRange = (dateRange: DateRange) : RangeBlockBox | undefined => {
    let startDate = new Date(
      dateRange.year, 
      dateRange.month, 
      dateRange.day, 
      Math.round(dateRange.startMinute / 60), 
      dateRange.startMinute % 60
    )

    let weekEnd = getDateInDays(TOTAL_COLS - 1);

    if (dateInRange(startDate, weekStart, weekEnd))
      return {
        bRow: Math.round(dateRange.startMinute / CELL_HEIGHT),
        tRow: Math.round(dateRange.endMinute / CELL_HEIGHT),
        col: startDate.getDate() - weekStart.getDate() 
      }
    return undefined;
  }

  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const rangeBoxes = getRangeBoxesFromDateRanges(dateRanges)
  
  const updateDateRanges = (rangeBoxes: RangeBlockBox[]) : void => {
    const dateRanges: DateRange[] = []

    for (let rangeBox of rangeBoxes) {
      let startRow = rangeBox.bRow;
      let endRow = rangeBox.tRow;

      let dayOffset = rangeBox.col;
      let date = getDateInDays(dayOffset, weekStart);

      dateRanges.push({
        startMinute: startRow * CELL_MINUTES,
        endMinute: endRow * CELL_MINUTES,
        month: date.getMonth(),
        day: date.getDate(),
        year: date.getFullYear(),
        timezone
      })
    }

    onDateRangeChange(dateRanges);
  }

  const gotoNextWeek = () : void => {
    let newWeekStart = new Date(weekStart.getTime())
    newWeekStart.setDate(newWeekStart.getDate() + TOTAL_COLS)

    setWeekStart(newWeekStart)
  }

  const gotoPreviousWeek = () : void => {
    let newWeekStart = new Date(weekStart.getTime())
    newWeekStart.setDate(newWeekStart.getDate() - TOTAL_COLS)

    setWeekStart(newWeekStart)
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





export default Calendar;

