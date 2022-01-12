import React from "react";
import "./DayTimeSelector.css";

type DayTimeSelectorProps = {
  month: number,
  day: number,
  // hasLeftBorder: boolean,
  // hasRightBorder: boolean
}

const formatDate = (day: number, month: number) => ""

const DayTimeSelector: React.FC<DayTimeSelectorProps> = (props) => {

  return (
    <div className="dts-main">
      <div className="dts-topbar">
        {formatDate(props.day, props.month)}
      </div>
      <div className="dts-selector">
        d
      </div>
    </div>
  );
}

export default DayTimeSelector;
