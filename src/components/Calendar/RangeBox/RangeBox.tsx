import React from "react";
import Draggable from "react-draggable";
import "./RangeBox.css";

type RangeBoxProps = {
  bRow?: number, // bottom row
  tRow?: number, // top row

  col?: number,

  onRelease?: () => void,
  onChange?: () => void,
  onDelete?: () => void
};

const RangeBox: React.FC<RangeBoxProps> = (props) => {

  return (
    <Draggable
      axis="y"
      handle=".handle"
      defaultPosition={{x: 0, y: 0}}
      position={undefined}
      bounds={{top: 0, bottom: 24 * 4 * 20}}
      grid={[20, 20]}
      scale={1}
    >
      <div className="range-box-main">
        <div className="rb-cell extender">
          --
        </div>
        <div className="rb-cell handle">
          Hello!
        </div>
        <div className="rb-cell extender">
          --
        </div>
      </div>
    </Draggable>

  );
}

export default RangeBox;
