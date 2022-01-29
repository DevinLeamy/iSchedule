import React, { ReactNode, useState } from "react";
import classNames from "classnames";

import { Time, RangeBlock, DateRange, MemberRangeBlock, CalendarDate, RangeBlockBox, MemberDateRange } from "../../../types";
import RangeBox from "../../Calendar/RangeBox/RangeBox";
import { 
  getCalendarDate, 
  getDateRangesInRange, 
  getDateFromCalendarDate, 
  getSDate,
  getAbsMinutesFromDate,
  deepEqual 
} from "../../../utilities";
import { TimesList, GridCellsList, List } from "../../common";
import { CELLS_PER_DAY, DAYS_PER_WEEK, MINUTES_PER_CELL } from "../../../constants";
import CalendarHeader from "../../Calendar/CalendarHeader";
import CalendarDatesBar from "../../Calendar/CalendarDatesBar";
import { CalendarRangeSelector } from "../../Calendar/CalendarRangeSelector/CalendarRangeSelector";

import "./EventCalendar.css"

interface EventCalendarProps {
  eventDateRanges: DateRange[], // range boxes of the event
  membersDateRanges: MemberDateRange[], // range boxes of all of the members
  memberDateRanges: MemberDateRange[], // range boxes of the current, active, member
  timezone: string,
  cellWidth?: number,
  cellHeight?: number,
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  eventDateRanges,
  membersDateRanges,
  memberDateRanges,
  timezone,
  cellWidth = 130,
  cellHeight = 15
}) => {
  const calendarDates = getEventCalendarDates(eventDateRanges);
  const calendarColumns = Math.min(DAYS_PER_WEEK, calendarDates.length)
  const [startDateIndex, setStartDateIndex] = useState<number>(0);

  const getRangeBoxesFromDateRanges = (dateRanges: DateRange[]) : RangeBlockBox[] => {
    let startDate = getDateFromCalendarDate(calendarDates[startDateIndex])

    let endDateIndex = Math.min(calendarDates.length - 1, startDateIndex + calendarColumns);
    let endDate = getDateFromCalendarDate(calendarDates[endDateIndex])

    let dateRangesInRange = getDateRangesInRange(startDate, endDate, dateRanges)
    return dateRangesInRange.map(dateRange => getRangeBoxFromDateRange(dateRange))
  }

  const getCalendarDateIndexOfDateRange = (dateRange: DateRange) : number => {
    let drCalendarDate = getCalendarDate(dateRange.startDate)

    for (let i = 0; i < calendarDates.length; ++i) {
      if (deepEqual(calendarDates[i], drCalendarDate))
        return i;
    }

    return -1;
  }

  const getRangeBoxFromDateRange = (dateRange: DateRange) : RangeBlockBox => {
    let calendarDateIndex = getCalendarDateIndexOfDateRange(dateRange)
    return {
      bRow: Math.round(getAbsMinutesFromDate(dateRange.startDate) / MINUTES_PER_CELL),
      tRow: Math.round(getAbsMinutesFromDate(dateRange.endDate) / MINUTES_PER_CELL),
      col: calendarDateIndex - startDateIndex 
    }
  }

  const mapRangeBox = (
    rangeBox: RangeBlockBox, 
    id: number,
    onChange: (id: number, row: number, col: number, heightInCells: number) => void, 
    onDelete: (id: number) => void
  ) : React.ReactNode => {
    return (
      <RangeBox
        id={id}
        box={rangeBox}
        cellWidth={130}
        cellHeight={15}
        // onChange={onChange}
        // onDelete={onDelete}
        disableDeleting={true}
        disableDragging={true}
        disableResizing={true}
      >
        {/* <RangeBox
          id={rangeBox.bRow}
          box={rangeBox}
          cellWidth={120}
          cellHeight={15}
          // onChange={onChange}
          // onDelete={onDelete}
          // disableDeleting={true}
          // disableDragging={true}
          // disableResizing={true}
        /> */}
      </RangeBox>
    );
  }

  const rangeBoxes = getRangeBoxesFromDateRanges(eventDateRanges)
  // const dateRangeCells: DateRangeCell[] = getDateRangeCells(eventRangeBlocks);

  // const renderMembersRangeBlocks = () : ReactNode => {
  //   return membersRangeBlocks.map((memberRangeBlock, id) => {
  //     return (
  //       <RangeBox
  //         id={id}
  //         box={rangeBlockToRangeBox(memberRangeBlock as RangeBlock)}
  //         cellWidth={cellWidth / 2}
  //         cellHeight={cellHeight}
          // disableDeleting={true}
          // disableDragging={true}
          // disableResizing={true}
  //         disableTime={true}
  //       />
  //     )
  //   })
  // }

  // const renderMemberRangeBlocks = () : ReactNode => {
  //   return memberRangeBlocks.map((memberRangeBlock, id) => {
  //     return (
  //       <RangeBox
  //         id={id}
  //         box={rangeBlockToRangeBox(memberRangeBlock as RangeBlock)}
  //         cellWidth={cellWidth}
  //         cellHeight={cellHeight}
  //         // TODO:
  //         // onChange={undefined}
  //         // onDelete={undefined}
  //       />
  //     )
  //   })
  // }


  const gotoNextWeek = () : void => { 
    setStartDateIndex(Math.min(calendarDates.length - calendarColumns, startDateIndex + DAYS_PER_WEEK)) 
  }
  const gotoPreviousWeek = () : void => { 
    setStartDateIndex(Math.max(0, startDateIndex - DAYS_PER_WEEK)) 
  }

  return (
    <div className="calendar-main">
      <CalendarHeader 
        onNext={gotoNextWeek}
        onPrevious={gotoPreviousWeek}
      />
      <CalendarDatesBar 
        dates={calendarDates.slice(startDateIndex, startDateIndex + calendarColumns)}
      />
      <CalendarRangeSelector
        rangeBoxes={rangeBoxes}
        onRangeBoxesChange={() => {}}
        rangeBoxMap={mapRangeBox}
        rows={CELLS_PER_DAY}
        cols={calendarColumns}
      />
    </div>
  )
}

 // All of the dates that an events fall on
 const getEventCalendarDates = (dateRanges: DateRange[]) : CalendarDate[] => {
  let dates: CalendarDate[] = []
  
  for (let dateRange of dateRanges) {
    let calendarDate = getCalendarDate(dateRange.startDate);

    if (!dates.includes(calendarDate))
      dates.push(calendarDate)
  }
  return dates;
}

export { EventCalendar };
