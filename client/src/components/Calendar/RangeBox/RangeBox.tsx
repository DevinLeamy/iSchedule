import React, { useState, useRef, useEffect } from "react";
import { ResizeDirection } from "re-resizable";
import { DraggableEvent } from 'react-draggable';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { Time, Size, RangeBlockBox, TimeSlot } from "../../../types/types";
import { minToTime } from "../../../utilities/dates";
import { 
  Rnd, 
  ResizableDelta, 
  DraggableData, 
  Position
} from "react-rnd"
import "./RangeBox.css";
import { MINUTES_PER_CELL, MINUTES_PER_DAY } from "../../../constants";
import { clone } from "../../../utilities";

type RangeBoxProps = {
  timeSlot: TimeSlot,
  cellWidth?: number,
  cellHeight?: number,

  onChange?: (updatedTimeSlot: TimeSlot) => void,
  onDelete?: (timeSlot: TimeSlot) => void,

  disableDragging?: boolean,
  disableResizing?: boolean,
  disableDeleting?: boolean,
  disableTime?: boolean,
  children?: React.ReactNode
};

const RangeBox: React.FC<RangeBoxProps> = ({
  timeSlot,
  cellWidth=130,
  cellHeight=15,
  
  onChange = (updatedTimeSlot: TimeSlot) => {},
  onDelete = (timeSlot: TimeSlot) => {},

  disableDragging = false,
  disableResizing = false,
  disableDeleting = false,
  disableTime = false,
  children
}) => {
  const position: Position = {
    x: 0, 
    y: rowsToPixels(timeSlot.bottomRow, cellHeight)
  };

  const size: Size = {
    width: cellWidth - 10,
    height: rowsToPixels(timeSlot.topRow - timeSlot.bottomRow + 1, cellHeight)
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

    let updatedTimeSlot = clone(timeSlot)
    updatedTimeSlot.bottomRow = row
    updatedTimeSlot.topRow = row + heightInCells - 1

    onChange(updatedTimeSlot);
  }

  const handleDrag = (event: DraggableEvent, data: DraggableData) => {
    const row = pixelsToRows(data.y, cellHeight); 

    const heightInCells = pixelsToRows(size.height, cellHeight);

    let updatedTimeSlot = clone(timeSlot)
    updatedTimeSlot.bottomRow = row;
    updatedTimeSlot.topRow = row + heightInCells - 1

    onChange(updatedTimeSlot)
  }



  return (
    <Rnd
      disableDragging={disableDragging}
      dragAxis="y"
      bounds="parent"
      position={position}
      size={size}
      dragGrid={[cellWidth, 15]}
      resizeGrid={[15, 15]}
      onResizeStop={handleResize}
      onDragStop={handleDrag}
      // NOTE: enabling these slows things down but makes the 
      //       blocks update every frame
      // onResize={handleResize}
      // onDrag={handleDrag}
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
        bottomRow={timeSlot.bottomRow}
        topRow={timeSlot.topRow}
      />}

      {!disableDeleting &&
      <div onClick={() => onDelete(timeSlot)}>
        <DeleteOutlineIcon className="delete-range" />
      </div>}

      {!disableResizing && 
      <div className="drag-bar-container drag-bar-bottom">
        <div className="drag-bar" />
      </div>}
      {children}
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
