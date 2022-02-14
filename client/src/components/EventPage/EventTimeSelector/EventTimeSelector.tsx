import React, { useContext, useRef, useEffect, useState } from "react";

import { MemberRangeBlockBox, TimeSlot, Position, DateRange, MemberDateRange, RangeBlockBox } from "../../../types";
import { List } from "../../common";
import { EventContext } from "../../contexts";
import { getAbsMinutesFromDate, clone } from "../../../utilities";
import { CELL_HEIGHT } from "../../../constants";

import "./EventTimeSelector.css";

interface EventTimeSelectorProps {
  timeSlot: TimeSlot, // represents the space occupied by the box
}

const EventTimeSelector: React.FC<EventTimeSelectorProps> = ({
  timeSlot,
}) => {
  const lastUpdatedRow = useRef<number>(-1)
  const selectMode = useRef<boolean>(false)
  const mouseDown = useRef<boolean>(false)

  const { member, onTimeSlotUpdate } = useContext(EventContext);
  const rangeSelectorRef = useRef<HTMLDivElement | null>(null);
  const rowState: Array<Array<string>> = clone(timeSlot.availability)

  const getEventRow = (event: any) : number => {
    if (!rangeSelectorRef?.current) return 0; 

    const bounds = rangeSelectorRef.current.getBoundingClientRect();
    let y = event.clientY - bounds.top;
    let timeSlotRows = timeSlot.topRow - timeSlot.bottomRow + 1
    let row = Math.ceil((y / bounds.height) * timeSlotRows) - 1;

    return getAbsoluteRowFromLocalRow(row);
  }

  const getAbsoluteRowFromLocalRow = (localRow: number) => {
    return localRow + timeSlot.bottomRow;
  } 

  const onMouseDown = (event: any) => {
    if (member === undefined) return; 
    mouseDown.current = true;
    let row = getEventRow(event);


    if (rowState[row].includes(member)) {
      // remove member from row
      selectMode.current = false 
    } else {
      selectMode.current = true 
    }

    updateRow(row)
  }

  const onMouseUp = (event: any) => {
    mouseDown.current = false
    lastUpdatedRow.current = -1;
  }

  const onMouseMove = (event: any) => {
    let row = getEventRow(event)
    if (mouseDown.current) {
      updateRow(row)
    }
  }

  const getMaxAvailability = (rowState: Array<Array<string>>) : number => {
    // Calculate the number of unique members
    if (member === undefined) 
      return rowState.reduce((max, row) => Math.max(max, row.length), 0);

    let containsActiveMember: boolean = false; 
    let maxAvailability = 0

    for (let row of rowState) {
      maxAvailability = Math.max(maxAvailability, row.length)
      containsActiveMember ||= row.includes(member)
    }

    if (!containsActiveMember)
      ++maxAvailability;
    return maxAvailability;
  }

  const maxAvailability = getMaxAvailability(rowState)


  const updateRow = (index: number) : void => {
    if (member === undefined || lastUpdatedRow.current === index) return;

    let clonedAVB: Array<Array<string>> = clone(timeSlot.availability)

    // remove the member, to avoid duplicates
    clonedAVB[index] = clonedAVB[index].filter(m => m !== member)

    if (selectMode.current) {
      // add the member
      clonedAVB[index].push(member)
    } 

    timeSlot.availability = clonedAVB;

    lastUpdatedRow.current = index;

    onTimeSlotUpdate(timeSlot)
  }

  const mapRowState = (rowStateRow: Array<string>, index?: number) : React.ReactNode => {
    const brightness = 94 + rowStateRow.length * 15 
    const row = (index as number) + timeSlot.bottomRow;
    const included = (member === undefined || !rowState[row].includes(member))
    const maxWidth = rangeSelectorRef?.current?.getBoundingClientRect()?.width ?? 1

    const available = rowStateRow.length
    const width = (maxAvailability === 0 || available === 0) ? 1 : (available / maxAvailability) * maxWidth

    return (
      <div 
        className="row-state-row"
        style={{
          backgroundColor: included ? "var(--white)" : "var(--blue)",
          width: width
        }} 
      />
      // </div>
    )
  }

  return (
    <div 
      className="ets-main"
      ref={rangeSelectorRef}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
    >
      <List
        listItemMap={mapRowState}
        items={rowState.slice(timeSlot.bottomRow, timeSlot.topRow + 1)}
      />
    </div>
  )
}


export { EventTimeSelector };
