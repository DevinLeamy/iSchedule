import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CreateEventPage } from "../CreateEventPage/CreateEventPage";
import { EventPage } from "../EventPage/EventPage";
import { CreateEventContextProvider, EventContextProvider } from "../contexts";

const Navigator: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        <CreateEventContextProvider>
          <CreateEventPage />
        </CreateEventContextProvider>
      }/>
      <Route path="/event/:_id" element={
        <EventContextProvider>
          <EventPage />
        </EventContextProvider>
      }/>
    </Routes>
  );
}

export { Navigator }
