import React, { useState, useRef } from 'react';
import './PageOne.css';
import Page from "../../components/common/Page/Page";
import Header from "../../components/common/Header/Header";
import ContentBox from "../../components/common/ContentBox/ContentBox";
import Calendar from "../../components/Calendar/Calendar";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import { DateRange } from "../../types/types";

import TimezoneSelect, { ITimezone, allTimezones } from "react-timezone-select";

const PageOne: React.FC = () => {
  const [timezone, setTimezone] = useState<ITimezone>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const eventNameRef = useRef<HTMLInputElement>();
  const [dateRanges, setDateRanges] = useState<DateRange[]>([])


  const onDateRangeChange = (dateRanges: DateRange[]) : void => {
    setDateRanges(dateRanges);
  }

  const onCreateEvent = () : void => {
    if (eventNameRef === undefined || eventNameRef.current === undefined) {
      alert("Enter an event name");
      return;
    }

    let eventName: string = eventNameRef.current.value;
  }

  return (
    <Page>
      <Header content="Instantly schedule an event"/>
      <ContentBox>
        <div className='h-center-contents'>
          <TextField 
            label="" 
            variant="standard" 
            placeholder="Your event name"
            inputRef={eventNameRef}
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
        
        <div className="spacer"/>
        <Box>
          Select you timezone
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
