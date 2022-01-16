import React, { useState } from 'react';
import './PageOne.css';
import Page from "../../components/common/Page/Page";
import Header from "../../components/common/Header/Header";
import ContentBox from "../../components/common/ContentBox/ContentBox";
import Calendar from "../../components/Calendar/Calendar";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Radio from '@mui/material/Radio';
import { DateRange } from "../../types/types";

import TimezoneSelect, { ITimezone, allTimezones } from "react-timezone-select";

let MONTH_C: string = "MONTH_C";
let WEEK_C: string = "WEEK_C";

const PageOne: React.FC = () => {
  const [timezone, setTimezone] = useState<ITimezone>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [dateRanges, setDateRanges] = useState<DateRange[]>([])

  const [calendarType, setCalendarType] = React.useState<string>(WEEK_C);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalendarType(event.target.value);
  };

  const onDateRangeChange = (dateRanges: DateRange[]) : void => {
    setDateRanges(dateRanges);
  }


  return (
    <Page>
      <Header content="Instantly schedule an event"/>
      <ContentBox>
        <div className='h-center-contents'>
          <TextField 
            // id="standard-basic" 
            label="" 
            variant="standard" 
            placeholder="Your event name"
            style={{minWidth: "60%"}}
            inputProps={{style: {
              textAlign: "center", 
              fontSize: 30
            }}}
            InputLabelProps={{style: {
              visibility: "hidden"
            }}}
          />
        </div>
        <div className="spacer"/>
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
        <div className="spacer"/>
        <Box>
          Select you timezone
          {/* npm run build && serve -s build */}
          <TimezoneSelect 
            value={timezone}
            onChange={setTimezone}
            timezones={{...allTimezones}}
          /> 
        </Box>
        <div className="spacer"/>
        <div className='calendar-container'>
          <Calendar 
            timezone={typeof(timezone) === "string" ? timezone : timezone.value}
            days={7}
            dateRanges={dateRanges}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
        <div className="next-page-btn-container h-center-contents">
          <Button variant="contained">
            + Create the event
          </Button>
        </div>
     </ContentBox>
    </Page>
  );
};

export default PageOne;
