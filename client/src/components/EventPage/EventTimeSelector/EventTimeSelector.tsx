import React, { useContext } from "react";

import { MemberRangeBlockBox, RangeBlockBox } from "../../../types";
import { EventContext } from "../../contexts";

import "./EventTimeSelector.css";

interface EventTimeSelectorProps {
  box: RangeBlockBox,
}

const EventTimeSelector: React.FC<EventTimeSelectorProps> = ({
  box,
}) => {
  const { memberDateRanges, membersDateRanges } = useContext(EventContext);
  return (
    <div className="ets-main">
      <div className="availability-display">
        THIS IS WHO IS AVAILABLE
      </div>

    </div>
  )
}


export { EventTimeSelector };
