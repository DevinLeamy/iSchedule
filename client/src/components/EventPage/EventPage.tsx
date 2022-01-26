import React, { useEffect, useState, useRef } from "react";
import { Event, Member } from '../../types';
import { getEventById, getEventMember } from "../../api";
import "./EventPage.css";
import Page from "../../components/common/Page/Page";
import Header from "../../components/common/Header/Header";
import ContentBox from "../../components/common/ContentBox/ContentBox";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { TextField, TextFieldProps } from "@mui/material";

const EventPage: React.FC = () => {
  const { _id } = useParams();
  const memberNameRef = useRef<TextFieldProps>();
  const [event, setEvent] = useState<Event>();
  const [eventMember, setEventMember] = useState<Member>();

  console.log("Event ID:", _id)
  console.log("Event: ", event)

  useEffect(() => {
    if (_id === undefined)
      return;

    const getEvent = async () : Promise<void> => {
      const fetchedEvent: Event | undefined = await getEventById(_id);

      if (fetchedEvent !== undefined)
        setEvent(fetchedEvent)
    }

    getEvent();
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
       {/* <div>
          This is your team's availability
        </div>
        <div>
          This is your availability
        </div>
        <div>
          This is a comment section
        </div> */}
      </ContentBox>
    </Page>
  )
}

export { EventPage };
