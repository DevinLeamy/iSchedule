import React, { useState } from 'react';
import './PageOne.css';
import Page from "../../components/common/Page/Page";
import Header from "../../components/common/Header/Header";
import ContentBox from "../../components/common/ContentBox/ContentBox";
import Calendar from "../../components/Calendar/Calendar";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Radio from '@mui/material/Radio';

import TimezoneSelect, { ITimezone, allTimezones } from "react-timezone-select";


let MONTH_C: string = "MONTH_C";
let WEEK_C: string = "WEEK_C";

const PageOne: React.FC = () => {
  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const [calendarType, setCalendarType] = React.useState<string>(WEEK_C);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalendarType(event.target.value);
  };


  return (
    <Page>
      <Header content="Instantly schedule an event"/>
      <div className='spacer'/>
      <ContentBox>
        <div className='h-center-contents'>
          <TextField 
            // id="standard-basic" 
            label="" 
            variant="standard" 
            placeholder="Your event name"
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
        <div className="c-type-toggle-container">
          <span className="c-type-label">Week</span>
          <Radio
            checked={calendarType === WEEK_C}
            onChange={handleChange}
            value={WEEK_C}
          />
          <span className="c-type-label">Month</span>
          <Radio
            checked={calendarType === MONTH_C}
            onChange={handleChange}
            value={MONTH_C}
          />
        </div>
        <div className="spacer"/>
        <Box>
          Select your time zone 
          {/* npm run build && serve -s build */}
          <TimezoneSelect 
            value={selectedTimezone}
            onChange={setSelectedTimezone}
            timezones={{...allTimezones}}
          /> 
        </Box>
        <div className="spacer"/>
        <div className='calendar-container'>
          <Calendar 
            days={7}
          />
        </div>
        {/* <div className="next-page-btn-container"> */}
        <div className="next-page-btn-container h-center-contents">
          <Button variant="contained">
            + Create the event
          </Button>
        </div>
     </ContentBox>
    </Page>
  );
};

export default PageOne;
