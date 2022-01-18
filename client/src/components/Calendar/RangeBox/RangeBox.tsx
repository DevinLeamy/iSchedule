import React, { useState, useRef, useEffect } from "react";
import { ResizeDirection } from "re-resizable";
import { DraggableEvent } from 'react-draggable';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Time, Size } from "../../../types/types";
import { minToTime } from "../../../utilities/dates";
import { 
  Rnd, 
  ResizableDelta, 
  DraggableData, 
  Position
} from "react-rnd"
import "./RangeBox.css";
import { MINUTES_PER_DAY } from "../../../constants";

export type RangeBlockBox = {
  bRow: number, 
  tRow: number,
  col: number  
}

type RangeBoxProps = {
  id: number,
  box: RangeBlockBox,
  cellWidth: number,
  cellHeight: number,
  onChange: (id: number, row: number, heightInCells: number) => void,
  onDelete: (id: number) => void
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
    y: rowsToPixels(box.bRow, cellHeight)
  };

  const size: Size = {
    width: cellWidth - 20,
    height: rowsToPixels(box.tRow - box.bRow + 1, cellHeight)
  };

  const handleResize = (
    event: MouseEvent | TouchEvent, 
    direction: ResizeDirection, 
    elementRef: HTMLElement,
    delta: ResizableDelta,
    position: Position
  ) => {
    const row = pixelsToRows(position.y, cellHeight);
    const height = elementRef.getBoundingClientRect().height;
    const heightInCells = pixelsToRows(height, cellHeight)

    onChange(id, row, heightInCells);
  }

  const handleDrag = (event: DraggableEvent, data: DraggableData) => {
    const row = pixelsToRows(data.y, cellHeight); 
    const heightInCells = pixelsToRows(size.height, cellHeight);

    onChange(id, row, heightInCells);
  }

  return (
    <Rnd
      key={id}
      dragAxis="y"
      bounds="parent"
      position={position}
      size={size}
      dragGrid={[15, 15]}
      resizeGrid={[15, 15]}
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
      <div className="drag-bar-container drag-bar-top">
        <div className="drag-bar" />
      </div>
      <RBDateRange
        bottomRow={box.bRow}
        topRow={box.tRow}
        cellHeight={cellHeight}
      />
      <div onClick={() => onDelete(id)}>
        <DeleteOutlineIcon className="delete-range" />
      </div>
     <div className="drag-bar-container drag-bar-bottom">
        <div className="drag-bar" />
      </div>
   </Rnd>
  );
}

type RBDateRangeProps = {
  bottomRow: number,
  topRow: number,
  cellHeight: number
}

const RBDateRange: React.FC<RBDateRangeProps> = ({
  bottomRow,
  topRow,
  cellHeight
}) => {
  const startTime = getTimeFromRow(bottomRow, cellHeight);
  const endTime = getTimeFromRow(topRow + 1, cellHeight);

  const getCellDisplayText = () : string => {
    const startS = getStringFromTime(startTime)
    const endS = getStringFromTime(endTime)

    let frame = endTime.am ? 'am' : 'pm'

    if (startTime.am === endTime.am) 
      return `${startS} - ${endS}${frame}` 
    return `${startS}am - ${endS}pm` 
  } 

  return (
    <div className="rb-date-range">
      {getCellDisplayText()}
    </div>
  );
}

const getTimeFromRow = (row: number, cellHeight: number) : Time => {
  let minutes: number = row * cellHeight;
  if (minutes === MINUTES_PER_DAY)
    --minutes;
  
  return minToTime(minutes);
}

const pixelsToRows = (pixels: number, cellHeight: number) : number => {
  return Math.round(pixels / cellHeight);
}

const rowsToPixels = (rows: number, cellHeight: number) : number => {
  return rows * cellHeight;
}

const formatMinute = (minute: number) : string => {
  return (minute < 10) ? `0${minute}` : `${minute}`
}

const getStringFromTime = (time: Time) : string => {
  if (time.minute === 0) 
    return `${time.hour}`

  return `${time.hour}:${formatMinute(time.minute)}`;
}

export default RangeBox;