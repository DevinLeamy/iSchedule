import React from "react";
import Radio from '@mui/material/Radio';

type CalendarHeaderProps = {
  onNextWeek: () => void,
  onPreviousWeek: () => void
};

let MONTH_C: string = "MONTH_C";
let WEEK_C: string = "WEEK_C";

const CalendarHeader : React.FC<CalendarHeaderProps> = ({
  onNextWeek,
  onPreviousWeek
}) => {
  const [calendarType, setCalendarType] = React.useState<string>(WEEK_C);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalendarType(event.target.value);
  };

  return (
    <div className="calendar-header">
      <div 
        className="change-week-btn change-week-left"
        onClick={onPreviousWeek}
      >
        {"<"}
      </div>
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
      <div 
        className="change-week-btn change-week-right"
        onClick={onNextWeek}
      >
        {">"}
      </div>
    </div>
  );
}

export default CalendarHeader;
