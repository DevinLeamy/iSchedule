import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import classNames from "classnames";
import { DateRange, Coords } from "../../types/types";
import RangeBox, { RangeBlockBox } from "./RangeBox/RangeBox";
import "./Calendar.css"

type CalendarProps = {
  weekView?: boolean,
  days: number,
  dateRanges?: DateRange[],
  onDateRangeChange?: (newRanges: DateRange[]) => void
};

const TOTAL_MINUTES: number = 60 * 24;
const TOTAL_ROWS: number = 24 * 4;
const TOTAL_COLS: number = 3;


/*
We collect:
We make a grid.
We determine what tiles are selected in the grid.
We return the interpretation of the selected tiles as time intervals
*/


const Calendar: React.FC<CalendarProps> = (props) => {
  const rangeSelectorRef = useRef<HTMLDivElement | null>(null);
  const [rangeBoxes, setRangeBoxes] = useState<RangeBlockBox[]>([]);
  const [gridState, setGridState] = useState<boolean[][]>(
    Array.from(Array(TOTAL_ROWS), () => new Array(TOTAL_COLS))
  );

  const [mouseDown, setMouseDown] = useState<boolean>(false);

  const createRangeBox = (row: number, col: number) => {
    const rangeBlockBox: RangeBlockBox = {
      bRow: row,
      tRow: Math.min(TOTAL_ROWS - 1, row + 4), // one hour
      col: col
    };

    const clone = rangeBoxes.slice();
    clone.push(rangeBlockBox);

    // TODO: reconcile merges

    setRangeBoxes(clone);
  }

  const getRangeBoxesInCol = (col: number) : RangeBlockBox[] => {
    let colRangeBoxes: RangeBlockBox[] = [];

    for (let rangeBox of rangeBoxes) {
      if (rangeBox.col == col)
        colRangeBoxes.push(rangeBox)
    }

    return colRangeBoxes;
  }

  const renderRangeBoxesInCol = (col: number) : React.ReactNode => {
    let colRangeBoxes = getRangeBoxesInCol(col);

    return colRangeBoxes.map((rangeBox, id) =>
      <RangeBox
        id={id}
        box={rangeBox}
        onRelease={onRangeBoxRelease}
        onExtend={onRangeBoxExtend}
        onDelete={onRangeBoxDelete}
        onChange={() => {}}
      />
    );
  }

  const onRangeBoxRelease = () => {}
  const onRangeBoxExtend = (boxId: number) => {}
  // const onRangeBoxChange = () => {}
  const onRangeBoxDelete = (boxId: number) => {}

  const getRelativeCoords = (event: any) : Coords => {
    if (rangeSelectorBounds) {
      let x = event.clientX - rangeSelectorBounds().left;
      let y = event.clientY - rangeSelectorBounds().top;
      return {x: x, y: y};
    }

    return {x: -1, y: -1};
  };

  const updateGridState = (row: number, col: number) : void => {
    let cloned = gridState.map((arr) => arr.slice());
    cloned[row][col] = !gridState[row][col];

    setGridState(cloned);
  }

  // useEffect(() => {
  //   if (rangeSelectorRef && rangeSelectorRef.current) {
  //     // rangeSelectorRef.current.addEventListener("mousedown", handleMouseDown);
  //     // rangeSelectorRef.current.addEventListener("mouseup", handleMouseUp);
  //     // rangeSelectorRef.current.addEventListener("click", handleClick);
  //   }
  // }, []);

  const rangeSelectorBounds = () : DOMRect => {
    if (rangeSelectorRef?.current)
      return rangeSelectorRef.current.getBoundingClientRect();
    return new DOMRect();
  }


  const getRowFromCoords = (coords: Coords) : number => {
    return Math.floor((coords.y / rangeSelectorBounds().height) * TOTAL_ROWS);
  }

  const handleMouseMove = (event: any) => {
    if (!mouseDown) return;

    let coords = getRelativeCoords(event);
    let row = getRowFromCoords(coords);

    // updateGridState(row, 0);
  }

  const handleClick = (event: any) => {
    let coords = getRelativeCoords(event);
    let row = getRowFromCoords(coords);

    // also get col by x
    updateGridState(row, 0);
  }

  const handleMouseDown = (event: any) => {
    setMouseDown(true);
  }

  const handleMouseUp = (event: any) => {
    setMouseDown(false);
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
    const selected = gridState[row][col];

    return (
      <div 
        key={row * 999 } 
        className={classNames(
          "grid-cell",
          { "grid-cell-hour" : onHourBound },
          { "grid-cell-selected": selected } 
        )}
        onClick={() => createRangeBox(row, col)}
      />
    );
  }

  const renderRangeSelector = () : React.ReactNode => {
    return (
      <div className="rs-main">
        <div 
          className="rs-grid-container"
          ref={rangeSelectorRef}
          // onMouseMove={handleMouseMove}
        >
          {[...Array(TOTAL_COLS)].map((_, col) => {
            return renderGridRow(col);
          })}
        </div>
      </div>
    );
  }

  const renderRangeSelectorTopBar = () : React.ReactNode => {
    return (
      <div className="calendar-header">
        <div> January 7th </div>
        <div> January 7th </div>
        <div> January 7th </div>
        <div> January 7th </div>
        <div> January 7th </div>
      </div>
    );
  }

  const renderCalenderHeader = () : React.ReactNode => {
    return (
      <div className="calendar-header">
          <div 
          className="change-week-btn change-week-left"
          // onClick={() => {
          //   let newWeekStart: Date = getNextDate(weekStart, -props.days);
          //   setWeekStart(newWeekStart);
          // }}
        >
          {"<"}
        </div>
        <div className="week-header">
          {/* {`${formatDate(weekStart, true)} 
          - 
          ${formatDate(getNextDate(weekStart, props.days - 1), true)}` */}
          {/* } */}
        </div>
        <div 
          className="change-week-btn change-week-right"
          // onClick={() => {
          //   let newWeekStart: Date = getNextDate(weekStart, props.days);
          //   setWeekStart(newWeekStart);
          // }}
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

