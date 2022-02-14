import React, { useContext, useState, Dispatch } from "react";
import { useParams } from "react-router-dom";

import { Event, TimeSlot } from "../../types";
import { useEvent, useTimezone, usePersistedValue } from "../../hooks";
import { getTimezoneString } from "../../utilities"
import { ITimezone } from "react-timezone-select/dist";

interface EventContextI {
  event: Event | undefined

  member: string | undefined,
  setMember: Dispatch<string>,

  timezone: ITimezone,
  onTimezoneChange: Dispatch<ITimezone> 

  onTimeSlotUpdate: (timeSlot: TimeSlot) => void,

  cellHeight: number,
  cellWidth: number,

  respondents: Array<string>
}

const EventContext = React.createContext({} as EventContextI);

interface EventContextProviderProps {
  children: React.ReactNode,
}

const EventContextProvider: React.FC<EventContextProviderProps> = ({ 
  children,
}) => {
  const { _id } = useParams();
  const [timezone, onTimezoneChange] = useTimezone();
  const [member, setMember] = usePersistedValue<string | undefined>(undefined, "memberName");
  const [event, onTimeSlotUpdate] = useEvent(getTimezoneString(timezone), _id);

  const getAllRespondents  = () : Array<string> => {
    if (event === undefined) return new Array();

    let respondents = new Array<string>();

    for (let timeSlot of event.timeSlots)
      respondents.push(...timeSlot.availability.flat())
    
    return respondents.filter((r, i, a) => a.indexOf(r) === i)
  }

  return (
    <EventContext.Provider
      value={{
        event,

        member,
        setMember,

        timezone, onTimezoneChange,

        onTimeSlotUpdate,
        cellWidth: 130,
        cellHeight: 15,

        respondents: getAllRespondents()
      }}
    >
      {children}
    </EventContext.Provider> 
  )
}

export { EventContext, EventContextProvider }
