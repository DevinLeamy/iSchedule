import React, { useEffect, useState, useContext, useRef, CSSProperties as CSS } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useParams } from "react-router-dom";
import { TextField, Tooltip, TextFieldProps, Button, Box } from "@mui/material";
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';
import TimezoneSelect, { ITimezone, allTimezones } from "react-timezone-select";

import { EventContext } from "../contexts";
import { Page, Header, ContentBox } from "../../components/common";
import { EventCalendar } from "./EventCalendar/EventCalendar";
import { copy } from "../../utilities";

import "./EventPage.css";

const EventPage: React.FC = () => {
  const { _id } = useParams();
  const memberNameRef = useRef<TextFieldProps>();
  const [copied, setCopied] = useState<boolean>(false);
  const { timezone, onTimezoneChange, member, setMember, event } = useContext(EventContext)

  const onConfirmMemberName = async () => {
    if (memberNameRef?.current?.value && _id !== undefined) {
      const name: string = memberNameRef.current.value as string;
      setMember(name);
    }
  };

  const eventLink = `http://localhost:3000/event/${_id}`;

  // if (event === undefined) {
  //   return (
  //     <Page>
  //       <ContentBox>
  //         <Header content="Event does not exist!"/>
  //       </ContentBox>
  //     </Page>
  //   )
  // }

  return (
    <Page header={"Set Your Availability!"}>
      <ContentBox>
        <div className='h-center-contents' style={{position: "relative"}}>
          {/* NOTE: name-cover literally covers the input field so it cannot be selected */}
          <div className="name-cover" />
          <TextField 
            variant="outlined" 
            // TODO: can remove optional when "if (event === undefined)" is uncommented
            // placeholder={event?.name}
            value={event?.name}
            style={{minWidth: "60%", color: 'black'}}
            inputProps={{style: {
              textAlign: "center", 
              fontSize: 30,
            }}}
          />
        </div>
        <div>Share the event</div>
        <div className="copy-event-container">
          {/* https://mui.com/components/tooltips/ */}
          <Tooltip 
            TransitionComponent={Fade}
            title={copied ? "Copied!" : "Copy"} 
            arrow 
            placement="top"
            color={"blue"}
          >
            <div 
              className="event-link-container"
              onMouseEnter={() => setCopied(false)}
            >
              <div className="event-link" onClick={() => {setCopied(true); copy(eventLink)}}>{eventLink}</div>
              <ContentCopyIcon
                className="event-link-icon"
                style={{
                  lineHeight: 50,
                  marginTop: 10,
                  color: "grey",
                  fontSize: 30,
                }}
              />
            </div>
          </Tooltip>
        </div>
        <div>Enter your name</div>
        <div className="em-input-container">
          <TextField
            className="em-input"
            inputRef={memberNameRef}
            defaultValue={member ?? ""}
            style={{
              backgroundColor: "white",
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
  
        <div className="spacer" />
        <div className="ep-calendar-container calendar-container">
          <EventCalendar />
        </div>
        {/* <div className="spacer" /> */}
        <Box>
          Select your timezone
          <TimezoneSelect
            className="timezone-select"
            value={timezone}
            onChange={onTimezoneChange}
            timezones={{ ...allTimezones }}
          />
        </Box>
        <div className="spacer" />
        <div style={{ backgroundColor: "white", border: "1px solid grey" }}>
          Comments
        </div>
      </ContentBox>
    </Page>
  );
};

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
