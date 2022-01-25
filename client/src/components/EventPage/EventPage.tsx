import React, { useEffect, useState } from "react";
import { Event } from '../../types';
import { getEventById } from "../../api";
import "./EventPage.css";
import Page from "../../components/common/Page/Page";
import Header from "../../components/common/Header/Header";
import ContentBox from "../../components/common/ContentBox/ContentBox";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";

const EventPage: React.FC = () => {
  const { _id } = useParams();
  const [event, setEvent] = useState<Event>();

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
  }, [])

  return (
    <Page>
      <Header content="Set your availability" />
      <Header content={`Event: ${event?.name}`} />
      <ContentBox>
        <div>Share the event</div>
        <div className="copy-event-container">
          <div className="event-link-container">
            <div className="event-link">
              {`http://localhost:3000/event/${_id}`}
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
