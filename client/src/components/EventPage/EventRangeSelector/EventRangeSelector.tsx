import React, { useRef, useContext } from "react";

import { Position, CalendarDate, TimeSlot } from "../../../types/types";
import { TimesList, List, GridCell } from "../../common";
import { CELLS_PER_DAY } from "../../../constants";
import RangeBox from "../../Calendar/RangeBox/RangeBox";
import { EventTimeSelector } from "../EventTimeSelector/EventTimeSelector";
import { EventContext } from "../../contexts";
import { deepEqual } from "../../../utilities";

type EventRangeSelectorProps = {
  calendarDates: CalendarDate[],
  rows: number,
  cols: number
}

const EventRangeSelector: React.FC<EventRangeSelectorProps> = ({
  calendarDates,
  rows,
  cols
}) => {
  const { event, member } = useContext(EventContext);
  const rangeSelectorRef = useRef<HTMLDivElement | null>(null);

  if (event === undefined)
    return null;

  const onMouseDown = (e: any) : void => {
    if (member === undefined) {
      alert("Sign in to set your availability")
    }
  }

  const getTimeSlotsInDay = (date: CalendarDate) : TimeSlot[] => {
    return event.timeSlots.filter(timeSlot => deepEqual(date, timeSlot.date))
  }

  const mapTimeSlot = (timeSlot: TimeSlot) : React.ReactNode => {
    return (
      <div style={{
        position: "absolute",
        left: 0,
        top: timeSlot.bottomRow * 15,
        width: "100%",
      }}>
        <EventTimeSelector timeSlot={timeSlot} />
      </div>
      // </RangeBox>
    );
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
      />
    );
  }

  return (
    <div 
      className="rs-main"
      onMouseDown={onMouseDown}
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




export { EventRangeSelector };
