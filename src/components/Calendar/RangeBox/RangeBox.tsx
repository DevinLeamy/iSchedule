import React from "react";
import Draggable from "react-draggable";
import classNames from "classnames";
import "./RangeBox.css";

export type RangeBlockBox = {
  bRow: number, // bottom row (smaller value) 
  tRow: number, // top row    (heigher value)
  col: number   // column
}

type RangeBoxProps = {
  id: number,

  box: RangeBlockBox,

  onRelease: () => void,
  onExtend: (id: number) => void,
  onChange: () => void,
  onDelete: (id: number) => void
};

/*

// EXTENDING AND SHRINKING BLOCKS
- Mouse down on the extender
  - Record id of the block being extended
  - Record column of the block
- Mouseonenter a grid tile on the grid
  - Determine block that is being covered
  - If the block not selected and is a direct extension of the current range
    - Add the block to the range 
- Mouseonleave a grid tile on the grid
  - Determine block that is no longer covered
  - If the block was previously an ending block
    - The ending block is removed
- Updates are relayed down through the state

// CREATING A BLOCK
- Mouse click on the screen 
  - Determine the block that is being clicked

// DELETING A BLOCK
- Mouse click other delete button (which is visible onhover)
- Calls call back with block Id to remove the block

// MOVING A BLOCK
- User grabs the block at a holder
- User drags the block
// - OnRelease, block data is sent to the calendar
*/

type Time = {
  hour: number,
  minute: number
};

const RangeBox: React.FC<RangeBoxProps> = (props) => {
  const getTimeFromRow = (row: number) : Time => {
    const minutes: number = row * 15;

    return {
      hour: Math.floor(minutes / 60),
      minute: minutes % 60
    };
  }

  const getStringFromTime = (time: Time) : string => {
    let AM : boolean = time.hour < 12;

    return `${time.hour % 12}:${time.minute}${AM ? 'AM' : 'PM'}`;
  }

  const getCellDisplayText = () : string => {
    const startTime = getTimeFromRow(props.box.bRow);
    const endTime = getTimeFromRow(props.box.tRow);

    return `${getStringFromTime(startTime)} - ${getStringFromTime(endTime)}`;
  } 

  const renderDateRange = () : React.ReactNode => {
    return (
      <span className="rb-date-range">
        {getCellDisplayText()}
      </span>
    );
  }

  const renderExtenderCell = (topCell: boolean) : React.ReactNode => {
    // return <></>
    return (
      <div className="rb-cell extender" onClick={() => props.onExtend(props.id)}>
        {topCell ? renderDateRange() : <></>}
        =
      </div>
    );
  }
  const renderHandleCell = () : React.ReactNode => {
    // TODO: call handler to update the covered cells
    return <div className="handle rb-cell" onChange={() => {}}/>
  }

  const renderCell = (row: number) : React.ReactNode => {
    const extender = row == props.box.bRow || row == props.box.tRow;
    
    return extender ? renderExtenderCell(row == props.box.bRow) : renderHandleCell();
  }

  const renderBox = () : React.ReactNode => {
    const bottomRow = props.box.bRow;
    const topRow = props.box.tRow;

    return <>{[...Array(topRow - bottomRow + 1)].map((_, i) => renderCell(i + bottomRow))}</>;
  }

  return (
    <Draggable
      axis="y"
      handle=".handle"
      defaultPosition={{x: 0, y: 20 * props.box.bRow}}
      position={undefined}
      bounds={{top: 0, bottom: 24 * 4 * 20}}
      grid={[15, 15]}
      scale={1}
    >
      <div className="range-box-main">
        {renderBox()}
      </div>
    </Draggable>
  );
}

export default RangeBox;
