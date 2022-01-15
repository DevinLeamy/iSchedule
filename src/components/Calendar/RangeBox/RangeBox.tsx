import React, { useState, useRef, useEffect } from "react";
// import Draggable from "react-draggable";
import { ResizeDirection } from "re-resizable";
import { DraggableEvent } from 'react-draggable';
import { 
  Rnd, 
  ResizableDelta, 
  DraggableData, 
  Position
} from "react-rnd"
// import { Position } from "../../../hooks/useMouseCapture";
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

  onRelease: () => void,
  onExtend: (id: number, row: number, heightInCells: number) => void,
  onChange: () => void,
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
  
  // mousePosition,
  onRelease,
  onExtend,
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

    return `${time.hour % 12}:${time.minute}${AM ? 'AM' : 'PM'}`;
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

  // const renderExtenderCell = (topCell: boolean) : React.ReactNode => {
  //   return (
  //     <div 
  //       className="rb-cell extender" 
  //     >
  //       {topCell ? renderDateRange() : <></>}
  //       =
  //     </div>
  //   );
  // }
  // const renderHandleCell = () : React.ReactNode => {
  //   // TODO: call handler to update the covered cells
  //   return <div className="handle rb-cell" onChange={() => {}}/>
  // }

  // const renderCell = (row: number) : React.ReactNode => {
  //   const extender = row == box.bRow || row == box.tRow;
    
  //   return extender ? renderExtenderCell(row == box.bRow) : renderHandleCell();
  // }

  // const renderBox = () : React.ReactNode => {
  //   const bottomRow = box.bRow;
  //   const topRow = box.tRow;

  //   return <>{[...Array(topRow - bottomRow + 1)].map((_, i) => renderCell(i + bottomRow))}</>;
  // }

  const handleResize = (
    event: MouseEvent | TouchEvent, 
    direction: ResizeDirection, 
    elementRef: HTMLElement,
    delta: ResizableDelta,
    position: Position
  ) => {
    const row = Math.round(position.y / cellHeight);
    const heightInCells = Math.round((size.height + delta.height) / cellHeight);

    console.log("resize", row, heightInCells, size.height, delta.height);

    onExtend(id, row, heightInCells);
  }

  const handleDrag = (
    event: DraggableEvent, 
    data: DraggableData
  ) => {
    const row = Math.round(data.y / cellHeight);
    const heightInCells = Math.round(size.height / cellHeight);

    console.log("drag", row, heightInCells, size.height);

    onExtend(id, row, heightInCells);
  }

  console.log("POS", position.x, position.y)

  return (
    <Rnd
      key={id}
      dragAxis="y"
      dragGrid={[15, 15]}
      resizeGrid={[15, 15]}
      bounds="parent"
      position={position}
      size={size}
      // onResize={handleResize}
      onResizeStop={handleResize}
      onDragStop={handleDrag}
      // onDrag={handleDrag}
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
