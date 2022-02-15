import React from "react";
import { Radio, Button } from '@mui/material';
import classNames from "classnames"

type CalendarHeaderProps = {
  onNext: () => void,
  onPrevious: () => void,
  onClearCalendar?: () => void,
  leftDisabled?: boolean,
  rightDisabled?: boolean
};

let MONTH_C: string = "MONTH_C";
let WEEK_C: string = "WEEK_C";

const CalendarHeader : React.FC<CalendarHeaderProps> = ({
  onNext,
  onPrevious,
  onClearCalendar = () => {},
  leftDisabled = false,
  rightDisabled = false
}) => {
  const [calendarType, setCalendarType] = React.useState<string>(WEEK_C);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalendarType(event.target.value);
  };

  return (
    <div className="calendar-header">
      {!leftDisabled && (
        <div 
          className={classNames(
            "change-week-btn",
            "change-week-left",
            {
              "disabled": leftDisabled 
            }
          )}
          onClick={(e) => {
            if (!leftDisabled) {
              onPrevious()
            }
          }}
        >
          {leftDisabled ? "" : "<"}
        </div>
      )}
      <Button 
        onClick={onClearCalendar} 
      >
        Clear
      </Button>

      <div className="c-type-toggle-container">
        <span className="c-type-label">Week</span>
        <Radio
          checked={calendarType === WEEK_C}
          onChange={handleChange}
          value={WEEK_C}
        />
        <span className="c-type-label">Month</span>
        <Radio
          checked={calendarType === MONTH_C}
          onChange={handleChange}
          value={MONTH_C}
        />
      </div>
      {!rightDisabled && (
        <div 
          className={classNames(
            "change-week-btn",
            "change-week-right",
            {
              "disabled": rightDisabled 
            }
          )}
          onClick={(e) => {
            if (!rightDisabled) {
              onNext()
            }
          }}
        >
          {rightDisabled ? "" : ">"}
        </div>
      )}
   </div>
  );
}

export default CalendarHeader;
