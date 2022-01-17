import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import classNames from "classnames";
import { DateRange } from "../../types/types";
import { getDateInDays } from "../../utilities/dates";
import RangeBox, { RangeBlockBox } from "./RangeBox/RangeBox";
import CalendarHeader from "./CalendarHeader";
import CalendarDatesBar from "./CalendarDatesBar";
import { ITimezone } from "react-timezone-select";
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

export type Time = {
  hour: number,
  minute: number,
  am: boolean
};


const Calendar: React.FC<CalendarProps> = ({
  timezone,
  dateRanges,
  onDateRangeChange
}) => {
  const getRangeBoxesFromDateRanges = (dateRanges: DateRange[]) : RangeBlockBox[] => {
    let rangeBoxes : RangeBlockBox[] = []

    for (let dateRange of dateRanges) {
      let rangeBox = getRangeBoxFromDateRange(dateRange)

      if (rangeBox)
        rangeBoxes.push(rangeBox)
    }

    return rangeBoxes;
  }

  const getRangeBoxFromDateRange = (dateRange: DateRange) : RangeBlockBox | undefined => {
    let startDate = new Date(dateRange.year, dateRange.month, dateRange.day, Math.round(dateRange.startMinute / 60), dateRange.startMinute % 60)

    let weekEnd = getDateInDays(TOTAL_COLS - 1);

    if (weekStart.getTime() > startDate.getTime() || startDate.getTime() > weekEnd.getTime()) 
      return undefined;
    
    return {
      bRow: Math.round(dateRange.startMinute / 15),
      tRow: Math.round(dateRange.endMinute / 15),
      col: startDate.getDate() - weekStart.getDate() 
    }
  }

  const rangeSelectorRef = useRef<HTMLDivElement | null>(null);
  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const rangeBoxes = getRangeBoxesFromDateRanges(dateRanges)
  
  const createRangeBox = (row: number, col: number) => {
    const rangeBlockBox: RangeBlockBox = {
      bRow: row,
      tRow: Math.min(TOTAL_ROWS - 1, row + 3), // one hour
      col: col
    };

    const updated = rangeBoxes.slice();
    updated.push(rangeBlockBox);

    updateDateRanges(redrawRangeBoxes(updated));
  }

  const renderRangeBoxesInCol = (col: number) : React.ReactNode => {
    return rangeBoxes.map((rangeBox, id) => {
      if (rangeBox.col === col)
        return (
          <RangeBox
            id={id}
            box={rangeBox}
            cellWidth={Math.round(rangeSelectorBounds().width / TOTAL_COLS)}
            cellHeight={Math.round(rangeSelectorBounds().height / TOTAL_ROWS)}
            onChange={onRangeBoxChange}
            onDelete={onRangeBoxDelete}
          />
        );
      return <></>;
   });
  }

  const updateDateRanges = (rangeBoxes: RangeBlockBox[]) : void => {
    const dateRanges: DateRange[] = []

    for (let rangeBox of rangeBoxes) {
      let startRow = rangeBox.bRow;
      let endRow = rangeBox.tRow;

      let dayOffset = rangeBox.col;
      let date = getDateInDays(dayOffset, weekStart);
      

      console.log(date.getDate())
      dateRanges.push({
        startMinute: startRow * 15,
        endMinute: endRow * 15,
        month: date.getMonth(),
        day: date.getDate(),
        year: date.getFullYear(),
        timezone
      })
    }

    onDateRangeChange(dateRanges);
  }

  const onRangeBoxChange = (boxId: number, row: number, heightInCells: number) => {
    let updated = [...rangeBoxes];

    let rangeBox = {...rangeBoxes[boxId]};
    rangeBox.bRow = row;
    rangeBox.tRow = row + heightInCells - 1;

    updated[boxId] = rangeBox;

    updated = redrawRangeBoxes(updated)
    updateDateRanges(updated)
  }

  const redrawRangeBoxes = (updatedBoxes: RangeBlockBox[]) : RangeBlockBox[] => {
    let cellCovered: boolean[][] = [...Array(TOTAL_ROWS)].map(() => new Array(TOTAL_COLS).fill(false));

    for (let rangeBox of updatedBoxes) {
      // TODO: boxes get negative bRow when merged by draw from the bottom 
      for (let row = rangeBox.bRow; row <= rangeBox.tRow; ++row)
        cellCovered[row][rangeBox.col] = true;
    }

    let newRangeBoxes: RangeBlockBox[] = [];

    for (let col = 0; col < TOTAL_COLS; ++col) {
      let prevCovered = -1;

      for (let row = 0; row <= TOTAL_ROWS; ++row) {
        let covered = row === TOTAL_ROWS ? false : cellCovered[row][col];

        if (!covered && prevCovered !== -1) {
          newRangeBoxes.push({
            bRow: prevCovered,
            tRow: row - 1,
            col: col
          })
        } 
        
        if (covered && prevCovered === -1) {
          prevCovered = row;
        } 
        
        if (!covered) {
          prevCovered = -1;
        }
      }
    }

    return newRangeBoxes
  }

  const onRangeBoxDelete = (boxId: number) => {
    let updated = [...rangeBoxes];
    updated.splice(boxId, 1);

    redrawRangeBoxes(updated);
  }

  const rangeSelectorBounds = () : DOMRect => {
    if (rangeSelectorRef?.current)
      return rangeSelectorRef.current.getBoundingClientRect();
    return new DOMRect();
  }


  const renderGridRow = (col: number) : React.ReactNode => {
    return (
      <div className="rs-grid-row">
        {[...Array(TOTAL_ROWS)].map((_, row) => renderGridCell(row, col))}
        {renderRangeBoxesInCol(col)} 
      </div>
   );
  }

  const renderGridCell = (row: number, col: number) : React.ReactNode => {
    const onHourBound = row % 4 == 0;

    return (
      <div 
        key={row * 999 } 
        className={classNames(
          "grid-cell",
          { "grid-cell-hour" : onHourBound }
        )}
        onMouseDown={() => createRangeBox(row, col)}
      />
    );
  }

  const computeHourFrom24Hour = (totalHours: number) : number => {
    if (totalHours === 0)
      return 12
    if (totalHours > 12) 
      return totalHours - 12
    return totalHours
  }

  const getTimeFromRow = (row: number) : Time => {
    let minutes: number = row * 15;
    if (minutes === 24 * 60)
      --minutes;

    let totalHours = Math.floor(minutes / 60)
    let hour = computeHourFrom24Hour(totalHours);
    let minute = minutes % 60
    let am = totalHours < 12

    return { hour, minute, am };
  }

  const formatMinute = (minute: number) : string => {
    return (minute < 10) ? `0${minute}` : `${minute}`
  }

  const getStringFromTime = (time: Time) : string => {
    let zone = time.am ? 'AM' : 'PM'
    if (time.minute === 0) 
      return `${time.hour} ${zone}`

    return `${time.hour}:${formatMinute(time.minute)} ${zone}`;
  }

  const renderRangeSelector = () : React.ReactNode => {
    return ( 
      <div className="rs-main">
        <div className="calendar-dates">
          {[...Array(TOTAL_ROWS)].map((_, row) => {
            if (row === 0) return <div className="calendar-date" />;
            if (row === TOTAL_ROWS) return <div className="calendar-date" />;
            if (row % 4 !== 0) return <div className="calendar-date" />;
            return (
              <div className="calendar-date">
                {getStringFromTime(getTimeFromRow(row))}
              </div> 
            )
         })}
        </div>
        <div 
          className="rs-grid-container"
          ref={rangeSelectorRef}
        >
          {[...Array(TOTAL_COLS)].map((_, col) => 
            renderGridRow(col)
          )}
        </div>
      </div>
    );
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
      {renderRangeSelector()}
   </div>
  );
}

// const CalendarRangeSelector = () => {

//   return (

//   )
// }




export default Calendar;

