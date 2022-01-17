import React, { useRef } from "react";
import classNames from "classnames";
import RangeBox, { RangeBlockBox } from "./RangeBox/RangeBox";
import { Time } from "../../types/types";


type CalendarRangeSelectorProps = {
  rangeBoxes: RangeBlockBox[],
  onRangeBoxesChange: (rangeBoxes: RangeBlockBox[]) => void,
  rows: number,
  cols: number
}

const CalendarRangeSelector: React.FC<CalendarRangeSelectorProps> = ({
  rangeBoxes,
  onRangeBoxesChange,
  rows,
  cols
}) => {
  const rangeSelectorRef = useRef<HTMLDivElement | null>(null);

  const onRangeBoxChange = (boxId: number, row: number, heightInCells: number) => {
    let updated = [...rangeBoxes];

    let rangeBox = {...rangeBoxes[boxId]};
    rangeBox.bRow = row;
    rangeBox.tRow = row + heightInCells - 1;

    updated[boxId] = rangeBox;

    onRangeBoxesChange(redrawRangeBoxes(updated))
  }

  const redrawRangeBoxes = (updatedBoxes: RangeBlockBox[]) : RangeBlockBox[] => {
    let cellCovered: boolean[][] = [...Array(rows)].map(() => new Array(rows).fill(false));

    for (let rangeBox of updatedBoxes) {
      // TODO: boxes get negative bRow when merged by draw from the bottom 
      for (let row = rangeBox.bRow; row <= rangeBox.tRow; ++row)
        cellCovered[row][rangeBox.col] = true;
    }

    let newRangeBoxes: RangeBlockBox[] = [];

    for (let col = 0; col < cols; ++col) {
      let prevCovered = -1;

      for (let row = 0; row <= rows; ++row) {
        let covered = row === rows ? false : cellCovered[row][col];

        if (!covered && prevCovered !== -1) {
          newRangeBoxes.push({
            bRow: prevCovered,
            tRow: row - 1,
            col: col
          })
        } 
        
        if (covered && prevCovered === -1)
          prevCovered = row;
        
        if (!covered)
          prevCovered = -1;
      }
    }

    return newRangeBoxes
  }

  const onRangeBoxDelete = (boxId: number) => {
    let updated = [...rangeBoxes];
    updated.splice(boxId, 1);

    onRangeBoxesChange(redrawRangeBoxes(updated));
  }


  const createRangeBox = (row: number, col: number) => {
    const rangeBlockBox: RangeBlockBox = {
      bRow: row,
      tRow: Math.min(rows - 1, row + 3), // one hour
      col: col
    };

    const updated = rangeBoxes.slice();
    updated.push(rangeBlockBox);

    onRangeBoxesChange(redrawRangeBoxes(updated));
  }

  const renderRangeBoxesInCol = (col: number) : React.ReactNode => {
    return rangeBoxes.map((rangeBox, id) => {
      if (rangeBox.col === col)
        return (
          <RangeBox
            id={id}
            box={rangeBox}
            cellWidth={Math.round(rangeSelectorBounds().width / rows)}
            cellHeight={Math.round(rangeSelectorBounds().height / rows)}
            onChange={onRangeBoxChange}
            onDelete={onRangeBoxDelete}
          />
        );
      return <></>;
   });
  }

  const renderGridRow = (col: number) : React.ReactNode => {
    return (
      <div className="rs-grid-row">
        {[...Array(rows)].map((_, row) => renderGridCell(row, col))}
        {renderRangeBoxesInCol(col)} 
      </div>
   );
  }

  const renderGridCell = (row: number, col: number) : React.ReactNode => {
    const onHourBound = row % 4 == 0;

    return (
      <div 
        key={row * 999 } 
        className={classNames(
          "grid-cell",
          { "grid-cell-hour" : onHourBound }
        )}
        onMouseDown={() => createRangeBox(row, col)}
      />
    );
  }

  const rangeSelectorBounds = () : DOMRect => {
    if (rangeSelectorRef?.current)
      return rangeSelectorRef.current.getBoundingClientRect();
    return new DOMRect();
  }


  return (
    <div className="rs-main">
      <div className="calendar-dates">
        {[...Array(rows)].map((_, row) => {
          if (row === 0) return <div className="calendar-date" />;
          if (row === rows) return <div className="calendar-date" />;
          if (row % 4 !== 0) return <div className="calendar-date" />;
          return (
            <div className="calendar-date">
              {getStringFromTime(getTimeFromRow(row))}
            </div> 
          )
        })}
      </div>
      <div 
        className="rs-grid-container"
        ref={rangeSelectorRef}
      >
        {[...Array(cols)].map((_, col) => 
          renderGridRow(col)
        )}
      </div>
    </div>
  );
}

const computeHourFrom24Hour = (totalHours: number) : number => {
  if (totalHours === 0)
    return 12
  if (totalHours > 12) 
    return totalHours - 12
  return totalHours
}

const getTimeFromRow = (row: number) : Time => {
  let minutes: number = row * 15;
  if (minutes === 24 * 60)
    --minutes;

  let totalHours = Math.floor(minutes / 60)
  let hour = computeHourFrom24Hour(totalHours);
  let minute = minutes % 60
  let am = totalHours < 12

  return { hour, minute, am };
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

export default CalendarRangeSelector;
