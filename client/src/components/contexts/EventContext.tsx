import React, { useContext, useState, Dispatch } from "react";

import { RangeBlockBox, MemberRangeBlockBox, DateRange, MemberDateRange } from "../../types";
import { useEvent } from "../../hooks";

interface EventContextI {
  eventId?: string,
  eventName?: string,

  memberName?: string,

  memberTimezone?: string,

  eventDateRanges: DateRange[], 
  membersDateRanges: MemberDateRange[],

  memberDateRanges: MemberDateRange[],
  onMemberDateRangeChange: (memberDateRange: MemberDateRange[]) => void,

  cellHeight: number,
  cellWidth: number
}

interface EventContextProviderProps {
  eventId?: string,
  children: React.ReactNode,
  memberName: string,
  memberTimezone: string
}

const EventContext = React.createContext({} as EventContextI);

const EventContextProvider: React.FC<EventContextProviderProps> = ({ 
  eventId,
  children,
  memberName,
  memberTimezone 
}) => {
  const [eventName, eventDateRanges, membersDateRanges] = useEvent(eventId);

  const onMemberDateRangeChange = (memberDateRange: MemberDateRange[]) : void => {

  }

  return (
    <EventContext.Provider
      value={{
        eventId,
        eventName,

        memberName,
        memberTimezone,

        eventDateRanges,
        membersDateRanges,

        memberDateRanges: membersDateRanges.filter(memberDR => memberDR.name === memberName),
        onMemberDateRangeChange,

        cellWidth: 130,
        cellHeight: 15
      }}
    >
      {children}
    </EventContext.Provider> 
  )
}

export { EventContext, EventContextProvider }
