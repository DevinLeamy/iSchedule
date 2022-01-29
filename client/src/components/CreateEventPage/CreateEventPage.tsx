import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import EventNoteIcon from '@mui/icons-material/EventNote';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import TimezoneSelect, { ITimezone, allTimezones } from "react-timezone-select";

import { usePersistedValue, useTimezone } from "../../hooks";
import { createEvent } from "../../api";
import { Page, Header, ContentBox } from "../common";
import { Calendar } from "../Calendar/Calendar";
import { DateRange, AbsTime } from "../../types/types";
import { deserializeDateRanges, serializeDateRanges, getTimezoneString } from "../../utilities";

import './CreateEventPage.css';


const CreateEventPage: React.FC = () => {
  let navigate = useNavigate(); 
  const [timezone, onTimezoneChange] = useTimezone();
  const [eventName, setEventName] = usePersistedValue<string>("", "eventName");
  const [dateRanges, setDateRanges] = usePersistedValue<DateRange[]>([], "dateRanges", {
    serialize: serializeDateRanges, deserialize: deserializeDateRanges 
  });

  const onDateRangeChange = (dateRanges: DateRange[]) : void => {
    setDateRanges(dateRanges);
  }

  const onEventNameChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
    setEventName(event.currentTarget.value);
  }

  const onCreateEvent = async () : Promise<void> => {
    if (eventName === "" || dateRanges.length === 0) {
      alert("event data is incomplete");
      return;
    }

    const eventId = await createEvent(eventName, dateRanges, getTimezoneString(timezone));

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
            value={eventName}
            style={{minWidth: "60%"}}
            inputProps={{style: {
              textAlign: "center", 
              fontSize: 30
            }}}
            InputLabelProps={{style: {
              visibility: "hidden"
            }}}
            onChange={onEventNameChange}
          />
        </div>
        <div className="spacer"/>
        
        <div className="spacer"/>
        <Box>
          Select your timezone
          <TimezoneSelect 
            className="timezone-select"
            value={timezone}
            onChange={onTimezoneChange}
            timezones={{...allTimezones}}
          /> 
        </Box>
        <div className="spacer"/>
        <div className='calendar-container'>
          <Calendar 
            timezone={getTimezoneString(timezone)}
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
