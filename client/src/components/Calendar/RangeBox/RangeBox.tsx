import React, { useState, useRef, useEffect } from "react";
import { ResizeDirection } from "re-resizable";
import { DraggableEvent } from 'react-draggable';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { Time, Size, RangeBlockBox } from "../../../types/types";
import { minToTime } from "../../../utilities/dates";
import { 
  Rnd, 
  ResizableDelta, 
  DraggableData, 
  Position
} from "react-rnd"
import "./RangeBox.css";
import { MINUTES_PER_CELL, MINUTES_PER_DAY } from "../../../constants";

type RangeBoxProps = {
  id: number,
  box: RangeBlockBox,
  cellWidth: number,
  cellHeight: number,

  onChange?: (id: number, row: number, col: number, heightInCells: number) => void,
  onDelete?: (id: number) => void,

  disableDragging?: boolean,
  disableResizing?: boolean,
  disableDeleting?: boolean,
  disableTime?: boolean
};

const RangeBox: React.FC<RangeBoxProps> = ({
  id,
  box,
  cellWidth,
  cellHeight,
  
  onChange = (id: number, row: number, col: number, heightInCells: number) => {},
  onDelete = (id: number) => {},

  disableDragging = false,
  disableResizing = false,
  disableDeleting = false,
  disableTime = false
}) => {
  const position: Position = {
    x: 0, 
    y: rowsToPixels(box.bRow, cellHeight)
  };

  const size: Size = {
    width: cellWidth - 10,
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

    onChange(id, row, box.col, heightInCells);
  }

  const handleDrag = (event: DraggableEvent, data: DraggableData) => {
    const row = pixelsToRows(data.y, cellHeight); 
    const col = box.col // + pixelsToCols(data.x, cellWidth);

    const heightInCells = pixelsToRows(size.height, cellHeight);

    onChange(id, row, col, heightInCells);
  }

  return (
    <Rnd
      key={id}
      disableDragging={disableDragging}
      dragAxis="y"
      bounds="parent"
      position={position}
      size={size}
      dragGrid={[cellWidth, 15]}
      resizeGrid={[15, 15]}
      onResize={handleResize}
      onResizeStop={handleResize}
      onDragStop={handleDrag}
      onDrag={handleDrag}
      className="range-box-main"
      enableResizing={{
        left: false,
        right: false,
        top: !disableResizing,
        bottom: !disableResizing 
      }}
    >
      {!disableResizing && 
      <div className="drag-bar-container drag-bar-top">
        <div className="drag-bar" />
      </div>}

      {!disableTime && 
      <RBDateRange
        bottomRow={box.bRow}
        topRow={box.tRow}
      />}

      {!disableDeleting &&
      <div onClick={() => onDelete(id)}>
        <DeleteOutlineIcon className="delete-range" />
      </div>}

      {!disableResizing && 
      <div className="drag-bar-container drag-bar-bottom">
        <div className="drag-bar" />
      </div>}
  </Rnd>
  );
}

type RBDateRangeProps = {
  bottomRow: number,
  topRow: number
}

const RBDateRange: React.FC<RBDateRangeProps> = ({
  bottomRow,
  topRow
}) => {
  const startTime = getTimeFromRow(bottomRow);
  const endTime = getTimeFromRow(topRow + 1);

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

const getTimeFromRow = (row: number) : Time => {
  let minutes: number = row * MINUTES_PER_CELL;
  if (minutes === MINUTES_PER_DAY)
    --minutes;
  
  return minToTime(minutes);
}

const pixelsToRows = (pixels: number, cellHeight: number) : number => {
  return Math.round(pixels / cellHeight);
}

const pixelsToCols = (pixels: number, cellWidth: number) : number => {
  return Math.round(pixels / cellWidth);
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
