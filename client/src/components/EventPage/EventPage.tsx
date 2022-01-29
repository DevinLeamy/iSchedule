import React, { useEffect, useState, useRef } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useParams } from "react-router-dom";
import { TextField, TextFieldProps, Button, Box } from "@mui/material";
import TimezoneSelect, { ITimezone, allTimezones } from "react-timezone-select";

import { Event, Member, DateRange, RangeBlockBox, CalendarDate } from '../../types';
import { getEventById, getEventMember } from "../../api";
import { Page, Header, ContentBox } from "../../components/common";
import { CalendarRangeSelector } from "../Calendar/CalendarRangeSelector/CalendarRangeSelector";
import { useTimezone } from "../../hooks";
import { getRangeBlocksFromDateRanges, deepEqual } from "../../utilities";
import { DateRangeSelector } from "./DateRangeSelector/DateRangeSelector";
import { 
  getDateInDays, 
  dateInRange, 
  daysBetween,
  getAbsYMD,
  getEndOfTheDay,
  minToAbsTime,
  getAbsMinutesFromDate,
  serializeDate,
  deserializeDate,
  getCalendarDate
} from "../../utilities/dates";

import "./EventPage.css";

//  {"startDate":"2022-01-30T09:45:00.000Z","endDate":"2022-01-30T12:15:00.000Z","_id":"61f2f2ac7a42f6ef5614423a"},
//  {"startDate":"2022-01-31T08:30:00.000Z","endDate":"2022-01-31T12:00:00.000Z","_id":"61f2f2ac7a42f6ef5614423b"},
//  {"startDate":"2022-02-01T07:00:00.000Z","endDate":"2022-02-01T11:45:00.000Z","_id":"61f2f2ac7a42f6ef5614423c"},
//     {"startDate":"2022-01-13T07:45:00.000Z","endDate":"2022-01-13T10:15:00.000Z","_id":"61f2f2ac7a42f6ef5614423d"},
//     {"startDate":"2022-01-16T07:45:00.000Z","endDate":"2022-01-16T11:30:00.000Z","_id":"61f2f2ac7a42f6ef5614423e"},
//     {"startDate":"2022-01-17T11:15:00.000Z","endDate":"2022-01-17T12:45:00.000Z","_id":"61f2f2ac7a42f6ef5614423f"},
//     {"startDate":"2022-02-07T07:15:00.000Z","endDate":"2022-02-07T09:00:00.000Z","_id":"61f2f2ac7a42f6ef56144240"},


const fakeData = `{
  "_id":"61f2f2ac7a42f6ef56144235",
  "name":"Test",
  "dateRanges": [
    {"startDate":"2022-01-26T10:15:00.000Z","endDate":"2022-01-26T12:00:00.000Z","_id":"61f2f2ac7a42f6ef56144236"},
    {"startDate":"2022-01-27T12:30:00.000Z","endDate":"2022-01-27T13:45:00.000Z","_id":"61f2f2ac7a42f6ef56144237"},
    {"startDate":"2022-01-28T12:00:00.000Z","endDate":"2022-01-28T12:45:00.000Z","_id":"61f2f2ac7a42f6ef56144238"},
    {"startDate":"2022-01-29T10:15:00.000Z","endDate":"2022-01-29T14:45:00.000Z","_id":"61f2f2ac7a42f6ef56144239"},
    {"startDate":"2022-02-08T08:30:00.000Z","endDate":"2022-02-08T10:15:00.000Z","_id":"61f2f2ac7a42f6ef56144241"}],
    "timezone":"America/Edmonton",
    "members": [
      {"name":"TestMember","dateRanges":[],"timezone":"America/Edmonton","_id":"61f2f45e6268b24fd81b055e"},
      {"name":"TestMember2","dateRanges":[],"timezone":"America/Edmonton","_id":"61f302d5fce74b6e453b126a"},
      {"name":"TestMember23","dateRanges":[],"timezone":"America/Edmonton","_id":"61f303002c9167a9cdc598a3"}
    ]
  }`

const EventPage: React.FC = () => {
  const { _id } = useParams();

  const [timezone, onTimezoneChange] = useTimezone();
  const memberNameRef = useRef<TextFieldProps>();
  const [event, setEvent] = useState<Event | undefined>(() => { 
    let data = JSON.parse(fakeData);
    let mapDateRange = (stringDateRange: any) : DateRange => {
      return {
        startDate: new Date(stringDateRange.startDate),
        endDate: new Date(stringDateRange.endDate),
        timezone: stringDateRange.timezone
      }
    }

    data.dateRanges = [...data.dateRanges].map(mapDateRange)
    return data;
  })
  const [eventMember, setEventMember] = useState<Member | undefined>({
    name: "dereck",
    dateRanges: [],
    timezone: "America/Edmonton"
  });

  // console.log("Event ID:", _id)
  console.log("Event: ", event)


  useEffect(() => {
    if (_id === undefined)
      return;

    // const getEvent = async () : Promise<void> => {
    //   const fetchedEvent: Event | undefined = await getEventById(_id);

    //   if (fetchedEvent !== undefined)
    //     setEvent(fetchedEvent)
    // }

    // getEvent();
  }, [_id])

  const onConfirmMemberName = async () => {
    if (memberNameRef?.current?.value && _id !== undefined) {
      const name: string = memberNameRef.current.value as string;

      const member = await getEventMember(name, _id);
      setEventMember(member);
    }
  }

  const eventLink = `http://localhost:3000/event/${_id}`;

  const copyEventLink = () => {
    navigator.clipboard.writeText(eventLink);
  }

  // All of thehttps://github.com/DevinLeamy dates that an events fall on
  const getEventCalendarDates = (dateRanges: DateRange[]) : CalendarDate[] => {
    let dates: CalendarDate[] = []
    
    for (let dateRange of dateRanges) {
      let calendarDate = getCalendarDate(dateRange.startDate);

      if (!dates.includes(calendarDate))
        dates.push(calendarDate)
    }
    return dates;
  }

  const renderEventDate = (date: CalendarDate) : React.ReactNode => {
    if (event === undefined) return null;

    let eventDateRanges = event
      .dateRanges
      .filter(dateRange => deepEqual(getCalendarDate(dateRange.startDate), date));

    let eventRangeBlocks = getRangeBlocksFromDateRanges(eventDateRanges)

    let membersDateRanges = []
    for (let member of event.members)
      membersDateRanges.push(...member.dateRanges)
    let membersRangeBlocks = getRangeBlocksFromDateRanges(membersDateRanges);

    return (
      <DateRangeSelector
        date={date}
        eventRangeBlocks={eventRangeBlocks}
        membersRangeBlocks={membersRangeBlocks}
        memberRangeBlocks={[]}
        cellHeight={5}
      />
    )
 }

  const renderEventDates = () => {
    if (event === undefined) return <div className="event-dates-container" />;

    let eventDates: CalendarDate[] = getEventCalendarDates(event.dateRanges)
    
    return (
      <div className="event-dates-container">
        {[...eventDates].map(eventDate => renderEventDate(eventDate))}
      </div>
    );
  } 

  return (
    <Page>
      <Header content="Set your availability" />
      <Header content={`Event: ${event?.name}`} />
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
            style={{
              fontWeight: "bolder",
              fontSize: "16px",
              textTransform: "none",
              borderRadius: 0,
              marginLeft: 10,
            }}
            onClick={() => copyEventLink()}
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
          />
          <Button
            className="em-input-button"
            variant="contained"
            style={{
              fontWeight: "bolder",
              width: "120px",
              fontSize: "16px",
              textTransform: "none",
              borderRadius: 0,
              marginLeft: 10,
            }}
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
        {renderEventDates()}
      </ContentBox>
    </Page>
  )
}

export { EventPage };
