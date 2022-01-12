import React from "react";
import "./TimeSlot.css";

type TimeSlotProps = {
  selected: boolean,
  onChange: () => void
};

const TimeSlot: React.FC<TimeSlotProps> = (props) => {

  return (
    <div>
      {props.selected ? "selected" : "not selected"}
    </div>
  );
}
