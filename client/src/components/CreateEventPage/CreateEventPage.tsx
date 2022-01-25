import React, { useState, useRef } from 'react';
import './CreateEventPage.css';
import { createEvent } from "../../api";
import Page from "../common/Page/Page";
import Header from "../common/Header/Header";
import ContentBox from "../common/ContentBox/ContentBox";
import Calendar from "../Calendar/Calendar";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import EventNoteIcon from '@mui/icons-material/EventNote';
import { DateRange, AbsTime } from "../../types/types";
import { useNavigate } from "react-router-dom";

import TimezoneSelect, { ITimezone, allTimezones } from "react-timezone-select";

const CreateEventPage: React.FC = () => {
  let navigate = useNavigate(); 
  const [timezone, setTimezone] = useState<ITimezone>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const eventNameRef = useRef<HTMLInputElement>();
  const [dateRanges, setDateRanges] = useState<DateRange[]>([])


  const onDateRangeChange = (dateRanges: DateRange[]) : void => {
    setDateRanges(dateRanges);
  }

  const onCreateEvent = async () : Promise<void> => {
    // TODO: I don't like this control flow
    if (eventNameRef === undefined || eventNameRef.current === undefined) {
      alert("Enter an event name");
      return;
    }

    let eventName: string = eventNameRef.current.value;

    if (eventName === '' || dateRanges.length === 0) {
      alert("event data is incomplete");
    }

    const eventId = await createEvent(eventName, dateRanges, typeof(timezone) === "string" ? timezone : timezone.value);

    if (eventId !== undefined)
      navigate(`/event/${eventId}`);
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
