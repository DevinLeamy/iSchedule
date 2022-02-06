import React, { useContext, useRef, useState } from "react";

import { Time, Position, RangeBlockBox, CalendarDate, TimeSlot } from "../../../types/types";
import { TimesList, List, GridCell } from "../../common";
import { useMouseCapture } from "../../../hooks/useMouseCapture";
import { CELLS_PER_DAY } from "../../../constants";
import { deepEqual } from "../../../utilities";
import RangeBox from "../RangeBox/RangeBox";
import { CreateEventContext } from "../../contexts";

type CalendarRangeSelectorProps = {
  calendarDates: CalendarDate[],
  // rangeBoxes: RangeBlockBox[],
  // onRangeBoxesChange: (rangeBoxes: RangeBlockBox[]) => void,
  // rangeBoxMap: (
  //   rangeBox: RangeBlockBox, 
  //   id: number,
  //   onChange: (id: number, row: number, col: number, heightInCells: number) => void, 
  //   onDelete: (id: number) => void
  // ) => React.ReactNode, 
  rows: number,
  cols: number
}

const CalendarRangeSelector: React.FC<CalendarRangeSelectorProps> = ({
  calendarDates,
  // rangeBoxes,
  // onRangeBoxesChange,
  // rangeBoxMap,
  rows,
  cols
}) => {
  const { timeSlots } = useContext(CreateEventContext);
  const rangeSelectorRef = useRef<HTMLDivElement | null>(null);
  const mousePosition = useMouseCapture(rangeSelectorRef, rows, cols);
  const [startPosition, setStartPosition] = useState<Position>();

  // const onRangeBoxChange = (boxId: number, row: number, col: number, heightInCells: number) => {
  //   let updated = [...rangeBoxes];

  //   let rangeBox = {...rangeBoxes[boxId]};
  //   rangeBox.col = col;
  //   rangeBox.bRow = row;
  //   rangeBox.tRow = row + heightInCells - 1;

  //   updated[boxId] = rangeBox;

  //   onRangeBoxesChange(redrawRangeBoxes(updated))
  // }

  // const redrawRangeBoxes = (updatedBoxes: RangeBlockBox[]) : RangeBlockBox[] => {
  //   let cellCovered: boolean[][] = [...Array(rows)].map(() => new Array(rows).fill(false));

  //   for (let rangeBox of updatedBoxes) {
  //     // TODO: boxes get negative bRow when merged by draw from the bottom 

  //     for (let row = rangeBox.bRow; row <= rangeBox.tRow; ++row) {
  //       cellCovered[row][rangeBox.col] = true;
  //     }
  //   }

  //   let newRangeBoxes: RangeBlockBox[] = [];

  //   for (let col = 0; col < cols; ++col) {
  //     let prevCovered = -1;

  //     for (let row = 0; row <= rows; ++row) {
  //       let covered = row === rows ? false : cellCovered[row][col];

  //       if (!covered && prevCovered !== -1) {
  //         newRangeBoxes.push({
  //           bRow: prevCovered,
  //           tRow: row - 1,
  //           col: col
  //         })
  //       } 
        
  //       if (covered && prevCovered === -1) prevCovered = row;
  //       if (!covered) prevCovered = -1;
  //     }
  //   }

  //   return newRangeBoxes
  // }

  // const onRangeBoxDelete = (boxId: number) => {
  //   let updated = [...rangeBoxes];
  //   updated.splice(boxId, 1);

  //   onRangeBoxesChange(redrawRangeBoxes(updated));
  // }

  const onCreateTimeSlot = (id: string) => {}
  const onTimeSlotDelete = (id: string) => {}

  const onMouseUp = () => {
    if (startPosition && mousePosition && startPosition.col === mousePosition.col) {
      const length = Math.abs(startPosition.row - mousePosition.row);
      const startRow = Math.min(startPosition.row, mousePosition.row);

      createRangeBox(startRow, startPosition.col, length);
    }
    setStartPosition(undefined);
  }

  const onMouseDown = (position: Position) => {
    setStartPosition(position);
  }

  // const createRangeBox = (row: number, col: number, length: number = 3) => {
  //   const rangeBlockBox: RangeBlockBox = {
  //     bRow: row,
  //     tRow: Math.min(rows - 1, row + Math.max(3, length)),
  //     col: col
  //   };

  //   const updated = rangeBoxes.slice();
  //   updated.push(rangeBlockBox);

  //   onRangeBoxesChange(redrawRangeBoxes(updated));
  // }

  // const getRangeBoxesInCol = (col: number) : { id: number, rangeBox: RangeBlockBox }[] => {
  //   return rangeBoxes
  //     .map((rangeBox, id) => { return {id, rangeBox} })
  //     .filter(identifiedRb => identifiedRb.rangeBox.col === col)
  // }

  const mapTimeSlot = (timeSlot: TimeSlot) : React.ReactNode => {
    return (
      <RangeBox
        id={timeSlot._id}
        box={{
          tRow: timeSlot.topRow,
          bRow: timeSlot.bottomRow,
          col: getCalendarDateIndexOfDate(timeSlot.date)
        }}
        cellWidth={130}
        cellHeight={15}
        onChange={onChange}
        onDelete={onDelete}
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

  // const mapGridCol = (col: number) : React.ReactNode => {
  //   return (
  //     <div className="rs-grid-row">
  //       <List
  //         items={Array.from(Array(rows).keys()).map(row => { return {row, col} })}
  //         listKeyMap={mapPositionToKey}
  //         listItemMap={mapPosition}
  //       />
  //       {getRangeBoxesInCol(col).map(identifiedRb => 
  //         rangeBoxMap(identifiedRb.rangeBox, identifiedRb.id, onRangeBoxChange, onRangeBoxDelete))} 
  //     </div>
  //  ); 
  // }

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
