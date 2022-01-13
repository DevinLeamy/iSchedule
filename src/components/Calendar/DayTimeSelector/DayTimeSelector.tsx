import React, { useState } from "react";
import type { Date, DateTimeRange, Time } from "../../../types/types";
import { formatDate } from "../../../utilities/dates";
import "./DayTimeSelector.css";
import TimeSlot from "./TimeSlot/TimeSlot";

type DayTimeSelectorProps = {
  date: Date,
  onChange: (newDateTimeRanges: DateTimeRange[]) => void 
  // hasLeftBorder: boolean,
  // hasRightBorder: boolean
}

const DayTimeSelector: React.FC<DayTimeSelectorProps> = (props) => {
  const [selected, setSelected] = useState<Array<boolean>>(
    new Array<boolean>(24 * 4).fill(false)
  );

  const [mouseDown, setMouseDown] = useState<boolean>(false);

  // selected date time ranges

  const updateDateTimeRanges = (selectedSlots: Array<boolean>) => {
    let newDateTimeRanges: DateTimeRange[] = [];

    let beginSlot: Time | undefined = undefined;

    // so it always terminates with a false
    const tSelectedSlots: Array<boolean> = [...selectedSlots, false];

    for (let i = 0; i < tSelectedSlots.length; ++i) {
      let timeInMinutes = i * 15;

      let timeSlot: Time = { hour: timeInMinutes / 60, minute: timeInMinutes % 60 };

      if (tSelectedSlots[i] && beginSlot !== undefined) {
        continue;
      } else if (tSelectedSlots[i] && beginSlot === undefined) {
        beginSlot = timeSlot;
      } else if (!tSelectedSlots[i] && beginSlot !== undefined) {
        newDateTimeRanges.push({
          startDateTime: { date: props.date, time: beginSlot },
          endDateTime:   { date: props.date, time: timeSlot  }
        });
        beginSlot = undefined;
      }
    }

    props.onChange(newDateTimeRanges);
  };

  return (
    <div className="dts-main">
      <div className="dts-topbar">
        {formatDate(props.date, true)}
      </div>
      <div 
        className="dts-selector"
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
      >
        {selected.map((slotSelected, i) => {
          return (
            <TimeSlot 
              key={i}
              selected={slotSelected} 
              onChange={() => {
                var newSelected = [...selected];
                
                if (mouseDown) {
                  newSelected[i] = !slotSelected;
                  updateDateTimeRanges(newSelected);
                  setSelected(newSelected)
                }
             }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DayTimeSelector;
