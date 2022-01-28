import React, { ReactNode } from "react";

import { RangeBlockBox, MemberRangeBlockBox } from "../../../types";
import RangeBox from "../../Calendar/RangeBox/RangeBox";
import CalendarDatesBar from "../../Calendar/CalendarDatesBar";

interface DateRangeSelectorProps {
  date: Date, // only care about YY-MM-DD
  eventRangeBoxes: RangeBlockBox[], // range boxes of the event
  membersRangeBoxes: MemberRangeBlockBox[], // range boxes of all of the members
  memberRangeBoxes: MemberRangeBlockBox[], // range boxes of the current, active, member
  cellWidth?: number,
  cellHeight?: number
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  date,
  eventRangeBoxes,
  membersRangeBoxes,
  memberRangeBoxes,
  cellWidth = 130,
  cellHeight = 15
}) => {
  const renderEventRangeBoxes = () : ReactNode => {
    return eventRangeBoxes.map((rangeBox, id) => {
      return (
        <RangeBox
          id={id}
          box={rangeBox}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          disableDeleting={true}
          disableDragging={true}
          disableResizing={true}
          disableTime={true}
        />
      )
    });
  } 

  const renderMembersRangeBoxes = () : ReactNode => {
    return membersRangeBoxes.map((memberRangeBox, id) => {
      return (
        <RangeBox
          id={id}
          box={memberRangeBox as RangeBlockBox}
          cellWidth={cellWidth / 2}
          cellHeight={cellHeight}
          disableDeleting={true}
          disableDragging={true}
          disableResizing={true}
          disableTime={true}
        />
      )
    })
  }

  const renderMemberRangeBoxes = () : ReactNode => {
    return memberRangeBoxes.map((memberRangeBox, id) => {
      return (
        <RangeBox
          id={id}
          box={memberRangeBox as RangeBlockBox}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          // TODO:
          // onChange={undefined}
          // onDelete={undefined}
        />
      )
    })
  }

  return (
    <div className="dr-selector-main">
      <CalendarDatesBar
        startDate={date}
        totalDays={1}
      />
      {renderEventRangeBoxes()}
      {renderMembersRangeBoxes()}
      {renderMemberRangeBoxes()}
    </div>
  )
}

export { DateRangeSelector };
