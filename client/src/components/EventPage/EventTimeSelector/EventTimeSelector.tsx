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

  if (member === undefined)
    return null;

  const rowState: Array<Array<string>> = clone(timeSlot.availability)
  const maxAvailability = rowState.reduce((prevMax, rowStateRow) => Math.max(prevMax, rowStateRow.length), 0) 

  const updateRow = (index: number) : void => {
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
    const brightness = 255 * (rowStateRow.length / maxAvailability)

    return (
      <div 
        className="row-state-row"
        style={{backgroundColor: `rgb(255, 255, ${brightness})`}} 
        onClick={() => updateRow(index as number)}
      />
    )
  }

  console.log(rowState)

  return (
    <div className="ets-main">
      <List
        listItemMap={mapRowState}
        items={rowState}
      />
    </div>
  )
}


export { EventTimeSelector };
