import React, { useState, Dispatch } from "react";
import { ITimezone, allTimezones } from "react-timezone-select";

const useTimezone = () : [ITimezone, Dispatch<ITimezone>]=> {
  const [timezone, setTimezone] = useState<ITimezone>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const onTimezoneChange = (newTimezone: ITimezone) : void => {
    setTimezone(newTimezone);
  }

  return [timezone, onTimezoneChange];
}

export { useTimezone }
