import React, { useState, useRef, useEffect } from "react";
import { ResizeDirection } from "re-resizable";
import { DraggableEvent } from 'react-draggable';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { 
  Rnd, 
  ResizableDelta, 
  DraggableData, 
  Position
} from "react-rnd"
import "./RangeBox.css";
import { Icon } from "@mui/material";

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
  minute: number,
  am: boolean
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
    if (time.minute === 0) 
      return `${time.hour}`

    return `${time.hour}:${formatMinute(time.minute)}`;
  }

  const getCellDisplayText = () : string => {
    const startTime = getTimeFromRow(box.bRow);
    const endTime = getTimeFromRow(box.tRow + 1);

    const startS = getStringFromTime(startTime)
    const endS = getStringFromTime(endTime)

    let frame = endTime.am ? 'am' : 'pm'

    if (startTime.am === endTime.am) 
      return `${startS} - ${endS}${frame}` 
    return `${startS}am - ${endS}pm` 
  } 

  const renderDateRange = () : React.ReactNode => {
    return (
      <div className="rb-date-range">
        {getCellDisplayText()}
      </div>
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
      {renderDateRange()}
      <div onClick={() => onDelete(id)}>
        <DeleteForeverIcon className="delete-range" />
      </div>
     <div className="drag-bar-container drag-bar-bottom">
        <div className="drag-bar" />
      </div>
   </Rnd>
  );
}

export default RangeBox;
