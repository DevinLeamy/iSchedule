import React, { useEffect, useState, useRef, CSSProperties as CSS } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useParams } from "react-router-dom";
import { TextField, TextFieldProps, Button, Box } from "@mui/material";
import TimezoneSelect, { ITimezone, allTimezones } from "react-timezone-select";

import { Event, Member, DateRange, RangeBlockBox, CalendarDate } from '../../types';
import { EventContextProvider } from "../contexts";
import { getEventById, getEventMember } from "../../api";
import { Page, Header, ContentBox } from "../../components/common";
import { CalendarRangeSelector } from "../Calendar/CalendarRangeSelector/CalendarRangeSelector";
import { Calendar } from "../Calendar/Calendar";
import { EventCalendar } from "./EventCalendar/EventCalendar";
import { useTimezone } from "../../hooks";
import { getRangeBlocksFromDateRanges, deepEqual, copy } from "../../utilities";
import { 
  getCalendarDate,
  getTimezoneString
} from "../../utilities";

import "./EventPage.css";


const EventPage: React.FC = () => {
  const { _id } = useParams();

  const [timezone, onTimezoneChange] = useTimezone();
  const memberNameRef = useRef<TextFieldProps>();
  const [eventMember, setEventMember] = useState<Member | undefined>({
    name: "dereck",
    dateRanges: [],
    timezone: "America/Edmonton"
  });

  // console.log("Event ID:", _id)
  // console.log("Event: ", event)


  // useEffect(() => {
  //   if (_id === undefined)
  //     return;

    // const getEvent = async () : Promise<void> => {
    //   const fetchedEvent: Event | undefined = await getEventById(_id);

    //   if (fetchedEvent !== undefined)
    //     setEvent(fetchedEvent)
    // }

    // getEvent();
  // }, [_id])

  const onConfirmMemberName = async () => {
    if (memberNameRef?.current?.value && _id !== undefined) {
      const name: string = memberNameRef.current.value as string;

      const member = await getEventMember(name, _id);
      setEventMember(member);
    }
  }

  const eventLink = `http://localhost:3000/event/${_id}`;

  return (
    <EventContextProvider
      eventId={_id} 
      memberName={eventMember?.name as string}
      memberTimezone={getTimezoneString(timezone)}
    >
      <Page>
        <Header content="Set your availability" />
        <Header content={`Event: sdf`} />
        <Header content={`You are: ${eventMember?.name}`} />
        <ContentBox>
          <div>Share the event</div>
          <div className="copy-event-container">
            <div className="event-link-container">
              <div className="event-link">
                {eventLink}
              </div>
            </div>
            <Button 
              className="copy-event-button"
              variant="contained"
              style={COPY_EVENT_BUTTON}
              onClick={() => copy(eventLink)}
            >
              Copy
              <ContentCopyIcon 
                className="event-link-icon" 
                style={{
                  fontSize: 20,
                  marginLeft: 15 
                }}
              />
            </Button>
          </div>
          <div className="spacer" />
          <div>Enter your name</div>
          <div className="em-input-container">
            <TextField
              className="em-input"
              placeholder="" 
              inputRef={memberNameRef}
              style={{
                backgroundColor: "white"
              }}
            />
            <Button
              className="em-input-button"
              variant="contained"
              style={EM_INPUT_BUTTON}
              onClick={() => onConfirmMemberName()}
            >
              Confirm
            </Button>
          </div>
          <Box>
            Select your timezone
            <TimezoneSelect 
              className="timezone-select"
              value={timezone}
              onChange={onTimezoneChange}
              timezones={{...allTimezones}}
            /> 
          </Box>
          <div className="spacer" />
          <div className="ep-calendar-container calendar-container">
            <EventCalendar
              // eventDateRanges={event ? event.dateRanges : []}
              // membersDateRanges={[]}
              // memberDateRanges={[]}
              // timezone={getTimezoneString(timezone)}
            />
          </div>
          <div className="spacer" />
          <div style={{backgroundColor: "white", border: '1px solid grey'}}>
            Comments
          </div>
        </ContentBox>
      </Page>
    </EventContextProvider>
  )
}

const COPY_EVENT_BUTTON : CSS = {
  fontWeight: "bolder",
  fontSize: "16px",
  textTransform: "none",
  borderRadius: 0,
  marginLeft: 10,
}

const EM_INPUT_BUTTON : CSS = {
  fontWeight: "bolder",
  fontSize: "16px",
  textTransform: "none",
  borderRadius: 0,
  marginLeft: 10,
}



export { EventPage };
