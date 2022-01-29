import React, { useRef, useState } from "react";
import classNames from "classnames";

import RangeBox from "../RangeBox/RangeBox";
import { getTimeFromRow } from "../../../utilities";
import { Time, Position, RangeBlockBox } from "../../../types/types";
import { TimesList, List } from "../../common";
import { useMouseCapture } from "../../../hooks/useMouseCapture";
import { CELLS_PER_DAY } from "../../../constants";

type CalendarRangeSelectorProps = {
  rangeBoxes: RangeBlockBox[],
  onRangeBoxesChange: (rangeBoxes: RangeBlockBox[]) => void,
  rangeBoxMap: (
    rangeBox: RangeBlockBox, 
    id: number,
    onChange: (id: number, row: number, col: number, heightInCells: number) => void, 
    onDelete: (id: number) => void
  ) => React.ReactNode, 
  rows: number,
  cols: number
}

type GridCell = {
  row: number,
  col: number
}

const CalendarRangeSelector: React.FC<CalendarRangeSelectorProps> = ({
  rangeBoxes,
  onRangeBoxesChange,
  rangeBoxMap,
  rows,
  cols
}) => {
  const rangeSelectorRef = useRef<HTMLDivElement | null>(null);
  const mousePosition = useMouseCapture(rangeSelectorRef, rows, cols);
  const [startPosition, setStartPosition] = useState<Position>();

  const onRangeBoxChange = (boxId: number, row: number, col: number, heightInCells: number) => {
    let updated = [...rangeBoxes];

    let rangeBox = {...rangeBoxes[boxId]};
    rangeBox.col = col;
    rangeBox.bRow = row;
    rangeBox.tRow = row + heightInCells - 1;

    updated[boxId] = rangeBox;

    onRangeBoxesChange(redrawRangeBoxes(updated))
  }

  const redrawRangeBoxes = (updatedBoxes: RangeBlockBox[]) : RangeBlockBox[] => {
    let cellCovered: boolean[][] = [...Array(rows)].map(() => new Array(rows).fill(false));

    for (let rangeBox of updatedBoxes) {
      // TODO: boxes get negative bRow when merged by draw from the bottom 

      for (let row = rangeBox.bRow; row <= rangeBox.tRow; ++row) {
        cellCovered[row][rangeBox.col] = true;
      }
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
        
        if (covered && prevCovered === -1) prevCovered = row;
        if (!covered) prevCovered = -1;
      }
    }

    return newRangeBoxes
  }

  const onRangeBoxDelete = (boxId: number) => {
    let updated = [...rangeBoxes];
    updated.splice(boxId, 1);

    onRangeBoxesChange(redrawRangeBoxes(updated));
  }

  const onMouseUp = () => {
    if (startPosition && mousePosition && startPosition.col === mousePosition.col) {
      const length = Math.abs(startPosition.row - mousePosition.row);
      const startRow = Math.min(startPosition.row, mousePosition.row);

      createRangeBox(startRow, startPosition.col, length);
    }
    setStartPosition(undefined);
  }

  const onMouseDown = (row: number, col: number) => {
    setStartPosition({ row, col });
  }

  const createRangeBox = (row: number, col: number, length: number = 3) => {
    const rangeBlockBox: RangeBlockBox = {
      bRow: row,
      tRow: Math.min(rows - 1, row + Math.max(3, length)),
      col: col
    };

    const updated = rangeBoxes.slice();
    updated.push(rangeBlockBox);

    onRangeBoxesChange(redrawRangeBoxes(updated));
  }

  const getRangeBoxesInCol = (col: number) : { id: number, rangeBox: RangeBlockBox }[] => {
    return rangeBoxes
      .map((rangeBox, id) => { return {id, rangeBox} })
      .filter(identifiedRb => identifiedRb.rangeBox.col === col)
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

  const mapGridCol = (col: number) : React.ReactNode => {
    return (
      <div className="rs-grid-row">
        <List
          items={Array.from(Array(rows).keys()).map(row => { return {row, col} })}
          listKeyMap={mapGridCellToKey}
          listItemMap={mapGridCell}
        />
        {getRangeBoxesInCol(col).map(identifiedRb => 
          rangeBoxMap(identifiedRb.rangeBox, identifiedRb.id, onRangeBoxChange, onRangeBoxDelete))} 
      </div>
   ); 
  }

  const mapGridCellToKey = (cell: GridCell) : number => cell.row * CELLS_PER_DAY + cell.col;

  const mapGridCell = (cell: GridCell) : React.ReactNode => {
    const onHourBound = cell.row % 4 == 0;

    // create a mapToGridCell prop
    return (
      <div 
        className={classNames(
          "grid-cell",
          { "grid-cell-hour" : onHourBound },
          { "grid-cell-selected" : cellInSelectedRange(cell.row, cell.col) } 
        )}
        onMouseDown={() => onMouseDown(cell.row, cell.col)}
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
          items={Array.from(Array(cols).keys())}
          listItemMap={mapGridCol}
          horizontal={true}
        />
      </div>
    </div>
  );
}




export { CalendarRangeSelector };
