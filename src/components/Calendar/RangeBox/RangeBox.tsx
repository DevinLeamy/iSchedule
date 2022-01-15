import React, { useState, useRef, useEffect } from "react";
import { ResizeDirection } from "re-resizable";
import { DraggableEvent } from 'react-draggable';
import { 
  Rnd, 
  ResizableDelta, 
  DraggableData, 
  Position
} from "react-rnd"
import "./RangeBox.css";

/*
Handle resize:
- Resize
- Calls callback 
- Adjust to fit grid
- Resolve merges
- Update state

Handle drag:
- Drag
- Calls callback 
- Adjust to fit grid
- Resolve merges
- Update state
*/

export type RangeBlockBox = {
  bRow: number, // bottom row (smaller value) 
  tRow: number, // top row    (heigher value)
  col: number   // column
}

export type Size = {
  width: number,
  height: number
}

type RangeBoxProps = {
  id: number,

  box: RangeBlockBox,

  cellWidth: number,
  cellHeight: number,

  onChange: (id: number, row: number, heightInCells: number) => void,
  onDelete: (id: number) => void
};

export type Time = {
  hour: number,
  minute: number
};

const RangeBox: React.FC<RangeBoxProps> = ({
  id,
  box,
  cellWidth,
  cellHeight,
  
  onChange,
  onDelete
}) => {
  const position: Position = {
    x: 0, 
    y: cellHeight * box.bRow
  };

  const size = {
    width: cellWidth - 20,
    height: cellHeight * (box.tRow - box.bRow + 1)
  };

  const getTimeFromRow = (row: number) : Time => {
    const minutes: number = row * 15;

    return {
      hour: Math.round(minutes / 60),
      minute: minutes % 60
    };
  }

  const getStringFromTime = (time: Time) : string => {
    let AM : boolean = time.hour < 12;

    return `${time.hour % 12}:${time.minute}${AM ? 'am' : 'pm'}`;
  }

  const getCellDisplayText = () : string => {
    const startTime = getTimeFromRow(box.bRow);
    const endTime = getTimeFromRow(box.tRow);

    return `${getStringFromTime(startTime)} - ${getStringFromTime(endTime)}`;
  } 

  const renderDateRange = () : React.ReactNode => {
    return (
      <span className="rb-date-range">
        {getCellDisplayText()}
      </span>
    );
  }

  const handleResize = (
    event: MouseEvent | TouchEvent, 
    direction: ResizeDirection, 
    elementRef: HTMLElement,
    delta: ResizableDelta,
    position: Position
  ) => {
    const row = Math.round(position.y / cellHeight);
    const height = elementRef.getBoundingClientRect().height;
    const heightInCells = Math.round(height / cellHeight);

    onChange(id, row, heightInCells);
  }

  const handleDrag = (
    event: DraggableEvent, 
    data: DraggableData
  ) => {
    const row = Math.round(data.y / cellHeight);
    const heightInCells = Math.round(size.height / cellHeight);

    onChange(id, row, heightInCells);
  }

  return (
    <Rnd
      key={id}
      dragAxis="y"
      dragGrid={[15, 15]}
      resizeGrid={[15, 15]}
      bounds="parent"
      position={position}
      size={size}
      onResize={handleResize}
      onResizeStop={handleResize}
      onDragStop={handleDrag}
      onDrag={handleDrag}
      className="range-box-main"
      enableResizing={{
        left: false,
        right: false,
        top: true,
        bottom: true
      }}
    >
      {renderDateRange()}
    </Rnd>
  );
}

export default RangeBox;
