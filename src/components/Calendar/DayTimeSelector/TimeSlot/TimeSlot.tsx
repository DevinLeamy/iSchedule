import React from "react";
import "./TimeSlot.css";
import classNames from "classnames";

type TimeSlotProps = {
  selected: boolean,
  onChange: () => void
};



const TimeSlot: React.FC<TimeSlotProps> = (props) => {

  return (
    <div 
      className={classNames(
        "time-slot-main", 
        { 'time-slot-selected': props.selected }
      )}
      onMouseLeave={props.onChange}
    >
    </div>
  );
}

export default TimeSlot;
