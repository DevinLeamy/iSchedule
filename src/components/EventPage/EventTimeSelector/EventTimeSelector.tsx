import React, { useContext, useRef, useEffect, useState } from "react";
import { ITimezone } from "react-timezone-select";

import { MemberRangeBlockBox, TimeSlot, Position, DateRange, MemberDateRange, RangeBlockBox, Respondent } from "../../../types";
import { List } from "../../common";
import { EventContext } from "../../contexts";
import { getAbsMinutesFromDate, clone, getTimezoneString } from "../../../utilities";
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

  const { member, timezone, respondents, selectedRespondents, onTimeSlotUpdate } = useContext(EventContext);
  const rangeSelectorRef = useRef<HTMLDivElement | null>(null);

  const [rowState, setRowState] = useState<Array<Array<string>>>(timeSlot.availability)
  const [currentTimezone, setCurrentTimezone]  = useState<ITimezone>(timezone)

  if (getTimezoneString(currentTimezone) !== getTimezoneString(timezone)) {
    setRowState(timeSlot.availability)
    setCurrentTimezone(timezone)
  }

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

    // NOTE: make update to database
    timeSlot.availability = clone(rowState)
    onTimeSlotUpdate(timeSlot)
  }

  const onMouseMove = (event: any) => {
    let row = getEventRow(event)
    if (mouseDown.current) {
      updateRow(row)
    }
  }


  const updateRow = (index: number) : void => {
    if (member === undefined || lastUpdatedRow.current === index) return;

    let clonedAVB: Array<Array<string>> = clone(rowState)

    // remove the member, to avoid duplicates
    clonedAVB[index] = clonedAVB[index].filter(m => m !== member)

    if (selectMode.current) {
      // add the member
      clonedAVB[index].push(member)
    } 

    setRowState(clonedAVB)

    lastUpdatedRow.current = index;
  }

  const mapRowState = (rowStateRow: Array<string>, index?: number) : React.ReactNode => {
    let included = member !== undefined && rowStateRow.includes(member)

    const outerColor = !included ? "#EEEEEE" : "var(--blue)" 
    return (
      <div 
        className="row-state-row"
        style={{
          boxSizing: "border-box",
          width: '100%' 
        }} 
      >
        {selectedRespondents.filter(r => r !== member).map((name) => (
          <div
            style={{
              // backgroundColor: !rowStateRow.includes(name) ? (respondents.find(r => r.name === name) as Respondent).color: "white",
              backgroundColor: (respondents.find(r => r.name === name) as Respondent).color,
              opacity: !rowStateRow.includes(name) ? 1.0 : 0.2,
              height: "100%",
              width: 8,
              marginRight: 1,
            }} 
          />
        ))}
        <div style={{
          flex: 1,
          backgroundColor: outerColor
        }}
        >
        </div>
      </div>
    )
  }

  return (
    <div 
      className="ets-main"
      ref={rangeSelectorRef}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={(e) => { onMouseUp(e); }}
    >
      <List
        listItemMap={mapRowState}
        items={rowState.slice(timeSlot.bottomRow, timeSlot.topRow + 1)}
      />
    </div>
  )
}


export { EventTimeSelector };
