import React, { useRef, useState } from "react";

import { Time, Position, RangeBlockBox } from "../../../types/types";
import { TimesList, List, GridCell } from "../../common";
import { CELLS_PER_DAY } from "../../../constants";
import RangeBox from "../../Calendar/RangeBox/RangeBox";
import { EventTimeSelector } from "../EventTimeSelector/EventTimeSelector";

type EventRangeSelectorProps = {
  rangeBoxes: RangeBlockBox[],
  onRangeBoxesChange?: (rangeBoxes: RangeBlockBox[]) => void,
  rows: number,
  cols: number
}

const EventRangeSelector: React.FC<EventRangeSelectorProps> = ({
  rangeBoxes,
  onRangeBoxesChange = {},
  rows,
  cols
}) => {
  const rangeSelectorRef = useRef<HTMLDivElement | null>(null);

  const getRangeBoxesInCol = (col: number) : { id: number, rangeBox: RangeBlockBox }[] => {
    return rangeBoxes
      .map((rangeBox, id) => { return {id, rangeBox} })
      .filter(identifiedRb => identifiedRb.rangeBox.col === col)
  }

  const mapRangeBox = (rangeBox: RangeBlockBox, id: number) : React.ReactNode => {
    return (
      <RangeBox
        id={id}
        box={rangeBox}
        cellWidth={130}
        cellHeight={15}
        disableDeleting={true}
        disableDragging={true}
        disableResizing={true}
      >
        <EventTimeSelector box={rangeBox} />
      </RangeBox>
    );
  }

  const mapGridCol = (col: number) : React.ReactNode => {
    return (
      <div className="rs-grid-row">
        <List
          items={Array.from(Array(rows).keys()).map(row => { return {row, col} })}
          listKeyMap={mapPositionToKey}
          listItemMap={mapPosition}
        />
        {getRangeBoxesInCol(col).map(identifiedRb => 
          mapRangeBox(identifiedRb.rangeBox, identifiedRb.id))} 
      </div>
   ); 
  }

  const mapPositionToKey = (cell: Position) : number => cell.row * CELLS_PER_DAY + cell.col;

  const mapPosition = (cell: Position) : React.ReactNode => {
    return (
      <GridCell
        location={{row: cell.row, col: cell.col}}
        style={{
          backgroundColor: "var(--white)"
        }}
      />
    );
  }

  return (
    <div 
      className="rs-main"
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




export { EventRangeSelector };
