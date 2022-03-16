import React, { useContext, useState, Dispatch } from "react";
import { useParams } from "react-router-dom";

import { Event, Message, TimeSlot, Respondent } from "../../types";
import { useEvent, useTimezone, usePersistedValue } from "../../hooks";
import { clone, convertMessagesToTimezone, convertTimeSlotsToTimezone, generateRandomColor, getRandomColorByName, getTimezoneString } from "../../utilities"
import { ITimezone } from "react-timezone-select/dist";
import { CELLS_PER_DAY, CELL_HEIGHT } from "../../constants";

interface EventContextI {
  event: Event | undefined

  member: string | undefined,
  onSetMember: (updatedMember: string) => void,

  timezone: ITimezone,
  onTimezoneChange: Dispatch<ITimezone> 

  onTimeSlotUpdate: (timeSlot: TimeSlot) => void,
  onNewMessage: (message: Message) => void,

  cellHeight: number,
  cellWidth: number,

  respondents: Array<Respondent>,

  selectedRespondents: Array<string>
  setSelectedRespondents: Dispatch<Array<string>>
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
  const [utcEvent, onTimeSlotUpdate, onNewMessage] = useEvent(_id);

  let event: Event | undefined  = undefined;

  if (utcEvent !== undefined) {
    event = {
      _id: utcEvent._id,
      name: utcEvent.name,
      timeSlots: convertTimeSlotsToTimezone(clone(utcEvent.timeSlots), getTimezoneString(timezone)),
      messages: convertMessagesToTimezone(clone(utcEvent.messages), getTimezoneString(timezone))
    }
  }

  const getAllRespondents  = () : Array<string> => {
    if (event === undefined) return new Array();

    let respondents = new Array<string>();

    for (let timeSlot of event.timeSlots)
      respondents.push(...timeSlot.availability.flat())
    
    return respondents.filter((r, i, a) => a.indexOf(r) === i).sort()
  }

  const [selectedRespondents, setSelectedRespondents] = useState<Array<string>>(
    member ? [member] : []
  )

  const onSetMember = (updatedMember: string) : void => {
    setSelectedRespondents([updatedMember])
    setMember(updatedMember)
  }

  const respondents = [...getAllRespondents()].map(name => { return {
    name: name,
    color: getRandomColorByName(name),
    // color: generateRandomColor()
  }})
  
  return (
    <EventContext.Provider
      value={{
        event,

        member,
        onSetMember,

        timezone, onTimezoneChange,

        onTimeSlotUpdate: (timeSlot: TimeSlot) => onTimeSlotUpdate(timeSlot, getTimezoneString(timezone)), 
        onNewMessage: (message: Message) => onNewMessage(message, getTimezoneString(timezone)),

        cellWidth: 130,
        cellHeight: CELL_HEIGHT,

        respondents,
        
        selectedRespondents: [...selectedRespondents].sort(),
        setSelectedRespondents
      }}
    >
      {children}
    </EventContext.Provider> 
  )
}

export { EventContext, EventContextProvider }
