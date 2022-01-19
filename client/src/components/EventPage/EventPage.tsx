import React from "react";
import "./EventPage.css";
import Page from "../../components/common/Page/Page";
import Header from "../../components/common/Header/Header";
import ContentBox from "../../components/common/ContentBox/ContentBox";

interface EventPageProps {
  eventId?: string
}

const EventPage: React.FC<EventPageProps> = ({
  eventId
}) => {
  return (
    <Page>
      <Header content="Set your availability" />
      <ContentBox>
        <div>
          Click to copy the event link
        </div>
        <div>
          Enter your name and set your availability
        </div>
        <div>
          This is your team's availability
        </div>
        <div>
          This is your availability
        </div>
        <div>
          This is a comment section
        </div>
      </ContentBox>
    </Page>
  )
}

export { EventPage };
