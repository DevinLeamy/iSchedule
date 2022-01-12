import React, { useState } from 'react';
import './PageOne.css';
import Page from "../../components/common/Page/Page";
import Header from "../../components/common/Header/Header";
import ContentBox from "../../components/common/ContentBox/ContentBox";
import Calendar from "../../components/Calendar/Calendar";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import TimezoneSelect, { ITimezone } from "react-timezone-select";
// import Intl from "intl";
import Kalend, { CalendarView } from 'kalend';
import 'kalend/dist/styles/index.css'; 


const PageOne: React.FC = () => {
  // const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>(
  //   Intl.DateTimeFormat().resolvedOptions().timeZone
  // );

  

  return (
    <Page>
      <Header content="Instantly schedule an event"/>
      <div className='spacer'/>
      <ContentBox>
        <Box>
          <TextField id="standard-basic" label="Event name" variant="outlined" style={{minWidth: 400}}/>
        </Box>
        <div className="spacer"/>
        <h4>Week - Month</h4>
        <Box>
          Timezone select
          {/* <TimezoneSelect 
            value={selectedTimezone}
            onChange={setSelectedTimezone}
            timezones={{...allTimezones}}
          />  */}
        </Box>
        <div className='calendar-container'>
          <Calendar />
        </div>
        <div>
          Selected date
        </div>
        <div className="next-page-btn-container">
          <Button variant="contained">
            + Create the event
          </Button>
        </div>
     </ContentBox>
    </Page>
  );
};

export default PageOne;
