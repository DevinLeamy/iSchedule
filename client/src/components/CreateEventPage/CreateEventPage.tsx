import React, { useState, useRef } from 'react';
import './CreateEventPage.css';
import Page from "../common/Page/Page";
import Header from "../common/Header/Header";
import ContentBox from "../common/ContentBox/ContentBox";
import Calendar from "../Calendar/Calendar";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import EventNoteIcon from '@mui/icons-material/EventNote';
import { DateRange, AbsTime } from "../../types/types";
import { minToAbsTime } from "../../utilities/dates";

import TimezoneSelect, { ITimezone, allTimezones } from "react-timezone-select";
import { Icon } from '@mui/material';

const CreateEventPage: React.FC = () => {
  const [timezone, setTimezone] = useState<ITimezone>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const eventNameRef = useRef<HTMLInputElement>();
  const [dateRanges, setDateRanges] = useState<DateRange[]>([])


  const onDateRangeChange = (dateRanges: DateRange[]) : void => {
    setDateRanges(dateRanges);
  }

  const mapDateRange = (dateRange: DateRange) : { startDate: Date, endDate: Date } => {
    const startTime: AbsTime = minToAbsTime(dateRange.startMinute)
    const endTime = minToAbsTime(dateRange.endMinute)

    const startDate = new Date(dateRange.year, dateRange.month, dateRange.day, startTime.hour, startTime.minute) 
    const endDate = new Date(dateRange.year, dateRange.month, dateRange.day, endTime.hour, endTime.minute) 

    return { startDate: startDate, endDate: endDate }
  }

  const onCreateEvent = async () : Promise<void> => {
    if (eventNameRef === undefined || eventNameRef.current === undefined) {
      alert("Enter an event name");
      return;
    }

    let eventName: string = eventNameRef.current.value;

    if (eventName === '' || dateRanges.length === 0) {
      alert("event data is incomplete");
    }

    await fetch("http://localhost:3000/events/create", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: eventName,
        dateRanges: [...dateRanges].map(mapDateRange),
        timezone: dateRanges[0].timezone,
        userIds: []
      })
    })
  }

  return (
    <Page>
      <ContentBox>
        <Header content="Instantly schedule an event"/>
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
          Select your timezone
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
        <Button 
          variant='outlined' 
          className="next-page-btn-container h-center-contents"
          onClick={() => onCreateEvent()}
        >
          <EventNoteIcon className="create-btn-icon" />
          Create
        </Button>
     </ContentBox>
    </Page>
  );
};

export { CreateEventPage };
