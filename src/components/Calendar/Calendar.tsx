import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import classNames from "classnames";
// import DayTimeSelector from "./DayTimeSelector/DayTimeSelector";
import { DateRange, Coords } from "../../types/types";
// import { getDate, getNextDate, formatDate } from "../../utilities/dates";
import "./Calendar.css"

type CalendarProps = {
  weekView?: boolean,
  days: number,
  dateRanges?: DateRange[],
  onDateRangeChange?: (newRanges: DateRange[]) => void
};

const TOTAL_MINUTES: number = 60 * 24;


const Calendar: React.FC<CalendarProps> = (props) => {
  const rangeSelectorRef = useRef<HTMLDivElement | null>(null);
  const [rangeSelectorBounds, setRangeSelectorBounds] = useState<DOMRect>(new DOMRect());
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  const getRelativeCoords = (event: any) : Coords => {
    if (rangeSelectorBounds) {
      let x = event.clientX - rangeSelectorBounds.left;
      let y = event.clientY - rangeSelectorBounds.top;
      return {x: x, y: y};
    }

    return {x: -1, y: -1};
  };



  useLayoutEffect(() => {
    if (rangeSelectorRef && rangeSelectorRef.current) {
      setRangeSelectorBounds(rangeSelectorRef.current.getBoundingClientRect());
    }
  }, [])

  useEffect(() => {
    if (rangeSelectorRef && rangeSelectorRef.current) {
      rangeSelectorRef.current.addEventListener("mousedown", handleMouseDown);
      rangeSelectorRef.current.addEventListener("mouseup", handleMouseUp);
    }
  }, []);


  const getCellFromCoords = (coords: Coords) : number => {
    const minute: number = Math.floor(TOTAL_MINUTES * (1 - coords.y / rangeSelectorBounds.height));

    const hours: number = Math.floor(minute / 60);
    const minutes: number = minute % 60;

    // return { hours, minutes };
    return 5;
  }

  // const [weekStart, setWeekStart] = useState<Date>(getDate());

  const handleMouseMove = (event: any) => {
    let coords = getRelativeCoords(event);

    // DO SOMETHING HERE
  }

  const handleMouseDown = (event: any) => {
    setMouseDown(true);
  }

  const handleMouseUp = (event: any) => {
    setMouseDown(false);
  }

  const renderGridRow = (date: Date) : React.ReactNode => {
    return (
      <div className="rs-grid-row">
        {[...Array(24)].map((_, i) => { 
          return renderGridCell(i * 15);
        })}
      </div>
   );
  }

  const renderGridCell = (minute: number) : React.ReactNode => {
    const onHourBound = minute % 60 == 0;
    return (
      <div className={classNames(
        "grid-cell",
        { "grid-cell-hour" : onHourBound } 
      )}/>
    );
  }

  const renderRangeSelector = () : React.ReactNode => {
    return (
      <div className="rs-main">
        <div 
          className="rs-grid-container"
          ref={rangeSelectorRef}
          onMouseMove={handleMouseMove}
        >
          {[...Array(props.days)].map(_ => {
            return renderGridRow(new Date());
          })}
        </div>
      </div>
    );
  }

  const renderCalenderHeader = () : React.ReactNode => {
    return (
      <div className="calendar-topbar">
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
      {renderRangeSelector()}
    </div>
  );
}

Calendar.defaultProps = {
  days: 7
};

export default Calendar;

