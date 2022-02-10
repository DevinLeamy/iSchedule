import React, { useContext, useState } from "react";

import { MemberRangeBlockBox, TimeSlot, DateRange, MemberDateRange, RangeBlockBox } from "../../../types";
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
  const { member, onTimeSlotUpdate } = useContext(EventContext);

  const rowState: Array<Array<string>> = clone(timeSlot.availability)

  const getMaxAvailability = (rowState: Array<Array<string>>) : number => {
    if (member === undefined) 
      return rowState.reduce((max, row) => Math.max(max, row.length), 0);

    let containsActiveMember: boolean = false; 
    let maxAvailability = 0

    for (let row of rowState) {
      maxAvailability = Math.max(maxAvailability, row.length)
      containsActiveMember ||= row.indexOf(member) !== -1
    }

    if (!containsActiveMember)
      ++maxAvailability;
    return maxAvailability;
  }

  const maxAvailability = getMaxAvailability(rowState)


  const updateRow = (index: number) : void => {
    if (member === undefined) return;

    let clonedAVB: Array<Array<string>> = clone(timeSlot.availability)

    if (clonedAVB[index].some(m => m === member)) {
      // remove the member
      clonedAVB[index] = clonedAVB[index].filter(m => m !== member)
    } else {
      clonedAVB[index].push(member)
    }

    timeSlot.availability = clonedAVB;

    onTimeSlotUpdate(timeSlot)
  }

  const mapRowState = (rowStateRow: Array<string>, index?: number) : React.ReactNode => {
    const brightness = 94 + rowStateRow.length * 15 
    const row = (index as number) + timeSlot.bottomRow;

    return (
      <div 
        className="row-state-row"
        style={{backgroundColor: `rgb(${brightness}, ${brightness}, ${brightness})`}} 
        onClick={() => updateRow(row)}
      >
        {rowStateRow.length}
      </div>
    )
  }

  return (
    <div className="ets-main">
      <List
        listItemMap={mapRowState}
        items={rowState.slice(timeSlot.bottomRow, timeSlot.topRow + 1)}
      />
    </div>
  )
}


export { EventTimeSelector };
