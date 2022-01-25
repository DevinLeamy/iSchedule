import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { CreateEventPage } from "../CreateEventPage/CreateEventPage";
import { EventPage } from "../EventPage/EventPage";

const Navigator = () => {
  return (
    <Routes>
      <Route path="/" element={<CreateEventPage />} />
      <Route path="/event/:_id" element={<EventPage />} />
    </Routes>
  );
}

export { Navigator }
