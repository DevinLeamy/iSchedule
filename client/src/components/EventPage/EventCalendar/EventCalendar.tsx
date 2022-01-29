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
// import "../../Calendar/Calendar.css"
// import "../../CreateEventPage/CreateEventPage.css"

interface EventCalendarProps {
  eventDateRanges: DateRange[], // range boxes of the event
  membersDateRanges: MemberDateRange[], // range boxes of all of the members
  memberDateRanges: MemberDateRange[], // range boxes of the current, active, member
  cellWidth?: number,
  cellHeight?: number
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  eventDateRanges,
  membersDateRanges,
  memberDateRanges,
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
  //         disableDeleting={true}
  //         disableDragging={true}
  //         disableResizing={true}
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

  // const mapGridCellToKey = (gridCell: DateRangeCell) : number => gridCell.row

  // const mapGridCell = (gridCell: DateRangeCell) : React.ReactChild => {
  //   let onHourBound = gridCell.row % 4 === 0;

  //   return (
  //     <div 
  //       className={classNames(
  //         "dr-grid-cell",
  //         { "dr-grid-cell-hour" : onHourBound },
  //         { "dr-grid-cell-selected" : gridCell.selected } 
  //       )}
  //       style={{height: cellHeight}}
  //       onMouseDown={() => {}}
  //     />
  //   );
  // }


  // const renderGridCells = () : React.ReactNode => {
  //   return (
  //     <List
  //       items={dateRangeCells}
  //       listItemMap={mapGridCell}
  //       listKeyMap={mapGridCellToKey}
  //     />
  //   )
  // }

  // const renderCalendarTimes = () : React.ReactNode => {
  //   const [minRow, maxRow] = getRowRange(eventRangeBlocks);
  //   return (
  //     <TimesList
  //       minMinutes={Math.max(0, minRow) * MINUTES_PER_CELL}
  //       maxMinutes={Math.min(CELLS_PER_DAY, maxRow) * MINUTES_PER_CELL}
  //       containerStyle={{width: 30}}
  //       dateStyle={{height: cellHeight, fontSize: 10}}
  //     />
  //   )
  // }

  // const renderCalendarDay = (date: CalendarDate) : React.ReactNode => {
  //   const sdate = getSDate(getDateFromCalendarDate(date))

  //   return (
  //     <div key={sdate.day} className="dr-calendar-day">
  //       <div className="dr-cd-month-day">
  //         {sdate.month.slice(0, 3)}{" "}{sdate.day}
  //       </div>
  //       {/* <div className="dr-cd-day">{sdate.day}</div> */}
  //       <div className="dr-cd-weekday">{sdate.weekday}</div>
  //     </div>
  //   )
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
        rows={CELLS_PER_DAY}
        cols={calendarColumns}
      />
    </div>
    // <div className="dr-selector-main">
    //   <div className="dr-date-container">
    //     {renderCalendarDay(date)}
    //   </div>
    //   <div className="dr-bl-times-container">
    //     <div className="dr-times-container">
    //       {renderCalendarTimes()}
    //     </div>
    //     <div className="dr-bl-container">
    //       {/* {renderEventRangeBlocks()} */}
    //       {renderMembersRangeBlocks()}
    //       {renderMemberRangeBlocks()}
    //       {renderGridCells()}
    //     </div>
    //  </div>
    // </div>
  )
}

const rangeBlockToRangeBox = (rangeBlock: RangeBlock) : RangeBlockBox => {
  return {
    bRow: rangeBlock.bRow,
    tRow: rangeBlock.tRow,
    col: 0
  }
}

const getRowRange = (rangeBlocks: RangeBlock[]) : [number, number] => {
  const buffer = 0
  const minimumDesiredRows = 0;
  let minRow = 24 * 4 
  let maxRow = 0 

  for (let rangeBlock of rangeBlocks) {
    minRow = Math.min(minRow, rangeBlock.bRow)
    maxRow = Math.max(maxRow, rangeBlock.tRow)
  }

  minRow = Math.max(0, minRow - buffer);
  maxRow = Math.min(CELLS_PER_DAY, maxRow + buffer);

  let totalRows = maxRow - minRow + 1;
  let missingRows = Math.max(0, minimumDesiredRows - totalRows);

  let appendToBottom = Math.min(minRow, Math.round(missingRows / 2));
  let appendToTop = missingRows - appendToBottom;

  minRow -= appendToBottom;
  maxRow += appendToTop;

  return [minRow, maxRow]
}

// const getDateRangeCells = (rangeBlocks: RangeBlock[]) : DateRangeCell[] => {
//   const [minRow, maxRow] = getRowRange(rangeBlocks);
//   let dateRangeCells: DateRangeCell[] = [...Array(maxRow - minRow + 1)].map((_, i) => {
//     return { row: i + minRow, selected: false }
//   })

//   for (let rangeBlock of rangeBlocks) {
//     dateRangeCells = dateRangeCells.map(dateCell => {
//       if (dateCell.row <= rangeBlock.tRow && dateCell.row >= rangeBlock.bRow) {
//         dateCell.selected = true;
//       }

//       return dateCell;
//     })
//   }


//   return dateRangeCells;
// }

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
