import React, { useContext, useEffect, useRef, useState } from "react";

import { Time, Position, RangeBlockBox, CalendarDate, TimeSlot } from "../../../types/types";
import { TimesList, List, GridCell } from "../../common";
import { useMouseCapture } from "../../../hooks/useMouseCapture";
import { CELLS_PER_DAY } from "../../../constants";
import { deepEqual } from "../../../utilities";
import RangeBox from "../RangeBox/RangeBox";
import { CreateEventContext } from "../../contexts";

type CalendarRangeSelectorProps = {
  calendarDates: CalendarDate[],
  rows: number,
  cols: number
}

const CalendarRangeSelector: React.FC<CalendarRangeSelectorProps> = ({
  calendarDates,
  rows,
  cols
}) => {
  const { timeSlots, onCreateTimeSlot, onDeleteTimeSlot, onUpdateTimeSlot } = useContext(CreateEventContext);
  const rangeSelectorRef = useRef<HTMLDivElement | null>(null);

  // Make useMouseCapture update state ONLY if a start position is selection
  // Perhaps replace it?
  const mousePosition = useMouseCapture(rangeSelectorRef, rows, cols);

  const [startPosition, setStartPosition] = useState<Position>();

  const onMouseUp = () => {
    if (startPosition && mousePosition && startPosition.col === mousePosition.col) {
      const length = Math.abs(startPosition.row - mousePosition.row);
      const startRow = Math.min(startPosition.row, mousePosition.row);

      onCreateTimeSlot(startRow, length, calendarDates[startPosition.col]);
    }
    setStartPosition(undefined);
  }

  const onMouseDown = (position: Position) => {
    setStartPosition(position);
  }

  const mapTimeSlot = (timeSlot: TimeSlot) : React.ReactNode => {
    return (
      <RangeBox
        key={timeSlot._id}
        timeSlot={timeSlot}
        cellWidth={130}
        cellHeight={15}
        onChange={onUpdateTimeSlot}
        onDelete={onDeleteTimeSlot}
      />
    );
  }

  const getTimeSlotsInDay = (date: CalendarDate) : TimeSlot[] => {
    return timeSlots.filter(timeSlot => deepEqual(date, timeSlot.date))
  }

  const cellInSelectedRange = (row: number, col: number) : boolean => {
    if (startPosition === undefined || mousePosition === undefined) 
      return false;

    if (col === startPosition.col && col === mousePosition.col) {
      let minRow = Math.min(mousePosition.row, startPosition.row)
      let maxRow = Math.max(mousePosition.row, startPosition.row)

      return (minRow <= row && row <= maxRow);
    }

    return false;
  }

  const getCalendarDateIndexOfDate = (date: CalendarDate) : number => {
    for (let i = 0; i < calendarDates.length; ++i) {
      if (deepEqual(calendarDates[i], date))
        return i;
    }

    return -1;
  }


  const mapCalendarDate = (date: CalendarDate) : React.ReactNode => {
    return (
      <div className="rs-grid-row">
        <List
          items={Array.from(Array(rows).keys()).map(row => { return {row, col: getCalendarDateIndexOfDate(date)} })}
          listKeyMap={mapPositionToKey}
          listItemMap={mapPosition}
        />
        {getTimeSlotsInDay(date).map(mapTimeSlot)} 
      </div>
   ); 
  }

  const mapPositionToKey = (cell: Position) : number => cell.row * CELLS_PER_DAY + cell.col;

  const mapPosition = (cell: Position) : React.ReactNode => {
    return (
      <GridCell
        location={{row: cell.row, col: cell.col}}
        selected={cellInSelectedRange(cell.row, cell.col) }
        onMouseDown={onMouseDown}
        hoverStyle={{
          cursor: "pointer",
          backgroundColor: "var(--blue)",
          opacity: 0.4
        }}
      />
    );
  }

  return (
    <div 
      className="rs-main"
      onMouseUp={() => onMouseUp()}
    >
      <TimesList />
      <div className="rs-grid-container" ref={rangeSelectorRef}>
        <List
          items={calendarDates}
          listItemMap={mapCalendarDate}
          horizontal={true}
        />
      </div>
    </div>
  );
}

export { CalendarRangeSelector };
