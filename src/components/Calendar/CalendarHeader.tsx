import React from "react";

type CalendarHeaderProps = {
  onNextWeek: () => void,
  onPreviousWeek: () => void
};

const CalendarHeader : React.FC<CalendarHeaderProps> = ({
  onNextWeek,
  onPreviousWeek
}) => {
  return (
    <div className="calendar-header">
      <div 
        className="change-week-btn change-week-left"
        onClick={onNextWeek}
      >
        {"<"}
    </div>
      <div className="week-header">
      </div>
      <div 
        className="change-week-btn change-week-right"
        onClick={onPreviousWeek}
      >
        {">"}
      </div>
    </div>
  );
}

export default CalendarHeader;
