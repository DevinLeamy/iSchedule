import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import classNames from "classnames";
import { DateRange, Coords } from "../../types/types";
import { useMouseCapture, Position } from "../../hooks/useMouseCapture";
import { getSDate, SDate } from "../../utilities/dates";
import RangeBox, { RangeBlockBox } from "./RangeBox/RangeBox";
import "./Calendar.css"

type CalendarProps = {
  weekView?: boolean,
  days: number,
  dateRanges?: DateRange[],
  onDateRangeChange?: (newRanges: DateRange[]) => void
};

/*
FEATURES TO ADD:
- Monthly calendar
- Vertical drag on weekly calendar
- Vertical + Horizontal drag on weekly calendar
- Delete blocks
- Squish blocks against top/bottom border
- Drag blocks between columns
- Better way to extend blocks 
- Select all-day blocks

TODO:
- Code review
- Implement the backend
- Testing
*/

const TOTAL_MINUTES: number = 60 * 24;
const TOTAL_ROWS: number = 24 * 4;
const TOTAL_COLS: number = 7;

export type Time = {
  hour: number,
  minute: number,
  am: boolean
};

const Calendar: React.FC<CalendarProps> = ({
  weekView,
  days,
  dateRanges,
  onDateRangeChange
}) => {
  const rangeSelectorRef = useRef<HTMLDivElement | null>(null);
  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const [rangeBoxes, setRangeBoxes] = useState<RangeBlockBox[]>([]);

  const createRangeBox = (row: number, col: number) => {
    const rangeBlockBox: RangeBlockBox = {
      bRow: row,
      tRow: Math.min(TOTAL_ROWS - 1, row + 3), // one hour
      col: col
    };

    const updated = rangeBoxes.slice();
    updated.push(rangeBlockBox);

    redrawRangeBoxes(updated);
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

  const updateDateRanges = (rangeBoxes: RangeBlockBox) : void => {

  }

  const onRangeBoxChange = (boxId: number, row: number, heightInCells: number) => {
    let updated = [...rangeBoxes];

    let rangeBox = {...rangeBoxes[boxId]};
    rangeBox.bRow = row;
    rangeBox.tRow = row + heightInCells - 1;

    updated[boxId] = rangeBox;

    redrawRangeBoxes(updated)
  }

  const redrawRangeBoxes = (updatedBoxes: RangeBlockBox[]) : void => {
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

    setRangeBoxes(newRangeBoxes)
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

  const renderCalendarDay = (date: Date) : React.ReactNode => {
    const sdate = getSDate(date)

    return (
      <div className="calendar-day">
        <div className="cd-month">{sdate.month.slice(0, 3)}</div>
        <div className="cd-day">{sdate.day}</div>
        <div className="cd-weekday">{sdate.weekday}</div>
      </div>
    )
  }

  const renderRangeSelectorTopBar = () : React.ReactNode => {
    return (
      <div className="calendar-days-main">
        <div className="calendar-dates-spacer" />
        <div className="calendar-days">
          {[...Array(TOTAL_COLS)].map((_, i) => {
            let day = new Date(weekStart.getTime())
            day.setDate(day.getDate() + i)

            return renderCalendarDay(day);
           })}
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

  const renderCalenderHeader = () : React.ReactNode => {
    return (
      <div className="calendar-header">
          <div 
          className="change-week-btn change-week-left"
          onClick={() => gotoPreviousWeek()}
        >
          {"<"}
        </div>
        <div className="week-header">
        </div>
        <div 
          className="change-week-btn change-week-right"
          onClick={() => gotoNextWeek()}
        >
          {">"}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-main">
      {renderCalenderHeader()}
      {renderRangeSelectorTopBar()}
      {renderRangeSelector()}
   </div>
  );
}

Calendar.defaultProps = {
  days: 7
};

export default Calendar;

