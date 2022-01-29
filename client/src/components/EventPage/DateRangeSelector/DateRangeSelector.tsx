import React, { ReactNode } from "react";
import classNames from "classnames";

import { Time, RangeBlock, MemberRangeBlock, CalendarDate, RangeBlockBox } from "../../../types";
import RangeBox from "../../Calendar/RangeBox/RangeBox";
import { getCalendarDate, getTimeFromRow, getDateFromCalendarDate, getSDate } from "../../../utilities";

import "./DateRangeSelector.css"

interface DateRangeSelectorProps {
  date: CalendarDate, // only care about YY-MM-DD
  eventRangeBlocks: RangeBlock[], // range boxes of the event
  membersRangeBlocks: MemberRangeBlock[], // range boxes of all of the members
  memberRangeBlocks: MemberRangeBlock[], // range boxes of the current, active, member
  cellWidth?: number,
  cellHeight?: number
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  date,
  eventRangeBlocks,
  membersRangeBlocks,
  memberRangeBlocks,
  cellWidth = 130,
  cellHeight = 15
}) => {
  const renderEventRangeBlocks = () : ReactNode => {
    return eventRangeBlocks.map((rangeBlock, id) => {
      return (
        <RangeBox
          id={id}
          box={rangeBlockToRangeBox(rangeBlock)} // TODO: Hacky
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          disableDeleting={true}
          disableDragging={true}
          disableResizing={true}
          // disableTime={true}
        />
      )
    });
  } 

  const renderMembersRangeBlocks = () : ReactNode => {
    return membersRangeBlocks.map((memberRangeBlock, id) => {
      return (
        <RangeBox
          id={id}
          box={rangeBlockToRangeBox(memberRangeBlock as RangeBlock)}
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

  const renderMemberRangeBlocks = () : ReactNode => {
    return memberRangeBlocks.map((memberRangeBlock, id) => {
      return (
        <RangeBox
          id={id}
          box={rangeBlockToRangeBox(memberRangeBlock as RangeBlock)}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          // TODO:
          // onChange={undefined}
          // onDelete={undefined}
        />
      )
    })
  }

  const renderGridCells = () : React.ReactNode => {
      return (
        <div className="rs-grid-row">
          {[...Array(24 * 4)].map((_, row) => renderGridCell(row))}
        </div>
    );
  }

  const renderGridCell = (row: number) : React.ReactNode => {
    const onHourBound = row % 4 == 0;

    return (
      <div 
        key={row * 999 } 
        // className={classNames(
        //   "grid-cell",
        //   { "grid-cell-hour" : onHourBound },
        //   { "grid-cell-selected" : cellInSelectedRange(row, col) } 
        // )}

        className={classNames(
          "grid-cell",
          { "grid-cell-hour" : onHourBound }
        )}
        style={{
          height: cellHeight
        }}
        // onMouseDown={() => onMouseDown(row, col)}
      />
    );
  }

  const renderCalendarTimes = () : React.ReactNode => {
    return (
      <div className="calendar-dates" style={{marginTop: 0}}>
        {[...Array(24 * 4)].map((_, row) => {
          if (row % 4 === 0 && row !== 24 * 4 && row !== 0) {
            return (
              <div key={row * 999} className="calendar-date" style={{height: cellHeight, fontSize: 10}}>
                {getStringFromTime(getTimeFromRow(row))}
              </div> 
            )
          } else return <div className="calendar-date" style={{height: cellHeight}}/>; 
        })}
      </div>
    )
  }

  const renderCalendarDay = (date: CalendarDate) : React.ReactNode => {
    const sdate = getSDate(getDateFromCalendarDate(date))

    return (
      <div key={sdate.day} className="calendar-day">
        <div className="cd-month">{sdate.month.slice(0, 3)}</div>
        <div className="cd-day">{sdate.day}</div>
        <div className="cd-weekday">{sdate.weekday}</div>
      </div>
    )
  }

  return (
    <div className="dr-selector-main">
      <div className="dr-date-container">
        {renderCalendarDay(date)}
      </div>
      <div className="dr-bl-times-container">
        <div className="dr-times-container">
          {renderCalendarTimes()}
        </div>
        <div className="dr-bl-container">
          {renderEventRangeBlocks()}
          {renderMembersRangeBlocks()}
          {renderMemberRangeBlocks()}
          {renderGridCells()}
        </div>
     </div>
    </div>
  )
}

const formatMinute = (minute: number) : string => {
  return (minute < 10) ? `0${minute}` : `${minute}`
}

const getStringFromTime = (time: Time) : string => {
  let zone = time.am ? 'AM' : 'PM'
  if (time.minute === 0) 
    return `${time.hour} ${zone}`

  return `${time.hour}:${formatMinute(time.minute)} ${zone}`;
}

const rangeBlockToRangeBox = (rangeBlock: RangeBlock) : RangeBlockBox => {
  return {
    bRow: rangeBlock.bRow,
    tRow: rangeBlock.tRow,
    col: 0
  }
}

const getRowRange = (rangeBlocks: RangeBlock[]) : [number, number] => {
  return [15, 15];
}
export { DateRangeSelector };
