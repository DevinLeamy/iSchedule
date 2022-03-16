import React, { useState, useEffect, useRef, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import EventNoteIcon from '@mui/icons-material/EventNote';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import TimezoneSelect, { ITimezone, allTimezones } from "react-timezone-select";

import { Page, Header, ContentBox } from "../common";
import { Calendar } from "../Calendar/Calendar";

import './CreateEventPage.css';
import { CreateEventContext } from '../contexts';


const CreateEventPage: React.FC = () => {
  let { 
    timezone, setTimezone,
    eventName, setEventName,
    onCreateEvent
  } = useContext(CreateEventContext);

  const onEventNameChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
    setEventName(event.currentTarget.value);
  }

  return (
    <Page header={"Instantly Schedule Events!"}>
      <ContentBox>
        <div className='h-center-contents'>
          <TextField 
            // label="Event Name" 
            variant="outlined" 
            placeholder="My Event Name"
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
        <div className='calendar-container'>
          <Calendar />
        </div>
        <Box>
          Select your timezone
          <TimezoneSelect 
            className="timezone-select"
            value={timezone}
            onChange={setTimezone}
            timezones={{...allTimezones}}
          /> 
        </Box>
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
