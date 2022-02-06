import { useEffect, useState } from "react";

import { getEventById } from "../api";
import { Event, TimeSlot } from "../types";
import { clone } from "../utilities";

/*
TODO: Added database updates and timezone conversions
*/

const useEvent = (localTimezone: string, eventId?: string) : [
  Event | undefined,
  (timeSlot: TimeSlot) => void
] => {
  const [event, setEvent] = useState<Event | undefined>(undefined)

  useEffect(() => {
    if (event === undefined) {
      getEventById(eventId ?? "")
        .then(event => setEvent(event))
    }
  }, [])

  const onTimeSlotUpdate = (updatedTimeSlot: TimeSlot) : void => {
    let clonedEvent: Event = clone(event);
    clonedEvent.timeSlots = clonedEvent.timeSlots.map(timeSlot => {
      return (timeSlot._id === updatedTimeSlot._id) ? updatedTimeSlot : timeSlot
    })

    setEvent(clonedEvent)
  }


  // if (event === undefined)
  //   return ["Loading...", [], [], (memberDateRanges: MemberDateRange[], memberName: string) => {}]

  // const membersDateRanges = getMemberDateRanges(event) 

  // const onMemberDateRangeChange = (memberDateRanges: MemberDateRange[], memberName: string) : void => {
  //   // NOTE: remove member
  //   let updatedDateRanges = membersDateRanges.filter(memberDR => memberDR.name !== memberName) 

  //   updatedDateRanges.push(...memberDateRanges);
  // }

  // const convertDateRangeToLocalTime = (utcDateRange: MemberDateRange) : MemberDateRange

  // const convertDateRangesToLocalTime = (utcDateRanges: MemberDateRange[]) : void => {
  //   // Need to check if this splits the time block between two days

  // }


  
  // return [event.name, event.dateRanges, membersDateRanges, onMemberDateRangeChange];
  return [event, onTimeSlotUpdate];
}

export { useEvent };
