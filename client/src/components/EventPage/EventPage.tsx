import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  CSSProperties as CSS,
} from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useParams } from "react-router-dom";
import { TextField, Tooltip, TextFieldProps, Button, Box } from "@mui/material";
import Fade from "@mui/material/Fade";
import TimezoneSelect, { ITimezone, allTimezones } from "react-timezone-select";

import { EventContext } from "../contexts";
import { EventRespondents } from "./EventRespondents/EventRespondents";
import { EventChat } from "./EventChat/EventChat";
import { Page, Header, ContentBox } from "../../components/common";
import { EventCalendar } from "./EventCalendar/EventCalendar";
import { copy } from "../../utilities";

import "./EventPage.css";

const EventPage: React.FC = () => {
  const { _id } = useParams();
  const memberNameRef = useRef<TextFieldProps>();
  const [copied, setCopied] = useState<boolean>(false);
  const { timezone, onTimezoneChange, member, onSetMember, event } =
    useContext(EventContext);

  const onConfirmMemberName = async () => {
    if (memberNameRef?.current?.value && _id !== undefined) {
      const name: string = memberNameRef.current.value as string;
      onSetMember(name);
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
        <div className="h-center-contents" style={{ position: "relative" }}>
          {/* NOTE: name-cover literally covers the input field so it cannot be selected */}
          <div className="name-cover" />
          <TextField
            variant="outlined"
            // TODO: can remove optional when "if (event === undefined)" is uncommented
            // placeholder={event?.name}
            value={event?.name}
            style={{ minWidth: "60%", color: "black" }}
            inputProps={{
              style: {
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bolder",
              },
            }}
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
              onClick={() => {
                setCopied(true);
                copy(eventLink);
              }}
            >
              <div className="event-link">{eventLink}</div>
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
        {/* TODO: have seperate components display based on whether a name has been confirmed or not */}
        <div>{member === undefined ? "Identify yourself" : "Signed in as"}</div>
        <div className="em-input-container">
          <TextField
            className="em-input"
            placeholder="Your name"
            inputRef={memberNameRef}
            variant="outlined"
            defaultValue={member ?? ""}
            inputProps={{
              backgroundColor: "white",
              textAlign: "center",
              fontSize: 30,
            }}
          />
          <Button
            className="em-input-button"
            variant="contained"
            style={EM_INPUT_BUTTON}
            onClick={() => onConfirmMemberName()}
          >
            {member === undefined ? "Confirm" : "Update"}
          </Button>
        </div>
        <Box className="respondents-container">
          Respondents
          <EventRespondents />
        </Box>
        {/* <div className="spacer" /> */}
        <div className="ep-calendar-container calendar-container">
          <EventCalendar />
        </div>
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
        <Box>
          Comments
          <EventChat />
        </Box>
      </ContentBox>
    </Page>
  );
};

const COPY_EVENT_BUTTON: CSS = {
  fontWeight: "bolder",
  fontSize: "16px",
  textTransform: "none",
  borderRadius: 0,
  marginLeft: 10,
};

const EM_INPUT_BUTTON: CSS = {
  fontWeight: "bolder",
  fontSize: "16px",
  textTransform: "none",
  borderRadius: 0,
  marginLeft: 10,
};

export { EventPage };
