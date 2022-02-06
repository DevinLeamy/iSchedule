import React, { useContext, useState, Dispatch } from "react";
import { useNavigate } from "react-router-dom";

import { Event, TimeSlot } from "../../types";
import { useTimezone, usePersistedValue } from "../../hooks";
import { ITimezone } from "react-timezone-select/dist";

interface EventContextI {
  setTimeSlots: Dispatch<TimeSlot[]>,
  setEventName: Dispatch<string>,
  setTimezone: Dispatch<ITimezone>,

  cellHeight: number,
  cellWidth: number,

  timezone: ITimezone,
  eventName: string,
  timeSlots: TimeSlot[],

  onCreateEvent: () => Promise<void>
}

const CreateEventContext = React.createContext({} as EventContextI);

interface CreateEventContextProviderProps {
  children?: React.ReactNode
}

const CreateEventContextProvider: React.FC<CreateEventContextProviderProps> = ({ 
  children
}) => {
  let navigate = useNavigate(); 
  const [timezone, setTimezone] = useTimezone();
  const [eventName, setEventName] = usePersistedValue<string>("", "eventName");
  const [timeSlots, setTimeSlots] = usePersistedValue<TimeSlot[]>([], "timeSlots")

 const onCreateEvent = async () : Promise<void> => {
    if (eventName === "" || timeSlots.length === 0) {
      alert("event data is incomplete");
      return;
    }

    // TODO: Convert timeslots to UTC
    const eventId = "cat" // await createEvent(eventName, dateRanges, getTimezoneString(timezone));

    if (eventId !== undefined)
      navigate(`/event/${eventId}`);
  }

  return (
    <CreateEventContext.Provider
      value={{
        eventName,
        setEventName,

        timezone, 
        setTimezone: setTimezone, 

        timeSlots,
        setTimeSlots,

        cellWidth: 130,
        cellHeight: 15,

        onCreateEvent
      }}
    >
      {children}
    </CreateEventContext.Provider> 
  )
}

export { CreateEventContext, CreateEventContextProvider }
