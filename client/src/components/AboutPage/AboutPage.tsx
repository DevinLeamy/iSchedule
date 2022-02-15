import React from "react"

import { ContentBox, Page } from "../common"

const AboutPage: React.FC = () => {
  return (
    <Page>
      <ContentBox>
        <h1>Why iSchedule?</h1>
        <p>
          iSchedule was designed to make instant scheduling easy for organizations, clubs, and small teams. New to an
          organization and want to take some initiative? Schedule an event in 3 simple steps: name your event,
          select your availability, and share the event link! 
        </p>
        <p>
          iSchedule takes the hassle out of sharing Google calendars, text messaging to find times that work, and 
          organizing events with participants all over the world. 
        </p>
        <p>
          <b>
            Make your life easier, try iSchedule!
          </b>
        </p>
      </ContentBox>
    </Page>
  )
}

export { AboutPage }
