import React, { useContext, useState, Dispatch } from "react";

import { Event, TimeSlot } from "../../types";
import { useEvent } from "../../hooks";

interface EventContextI {
  event: Event | undefined
  member: string | undefined,

  onTimeSlotUpdate: (timeSlot: TimeSlot) => void,

  cellHeight: number,
  cellWidth: number
}

const EventContext = React.createContext({} as EventContextI);

interface EventContextProviderProps {
  eventId?: string,
  children: React.ReactNode,
  member: string | undefined,
  localTimezone: string,
}

const EventContextProvider: React.FC<EventContextProviderProps> = ({ 
  eventId,
  children,
  member,
  localTimezone 
}) => {
  const [event, onTimeSlotUpdate] = useEvent(localTimezone, eventId);

  return (
    <EventContext.Provider
      value={{
        event,
        member,
        onTimeSlotUpdate,
        cellWidth: 130,
        cellHeight: 15
      }}
    >
      {children}
    </EventContext.Provider> 
  )
}

export { EventContext, EventContextProvider }
