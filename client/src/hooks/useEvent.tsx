import { useEffect, useState } from "react";

import { db, serializeTimeSlot, deserializeTimeSlot } from "../firebase";
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
    // subscribe to updates
    const unsubscribe = db.collection("events").doc(eventId)
      .onSnapshot(doc => {
        const serializedEvent: any = doc.data()
        setEvent({
          _id: serializedEvent._id,
          name: serializedEvent.name,
          timeSlots: serializedEvent.timeSlots.map(deserializeTimeSlot),
        })
      })

    // initialize event state
    db.collection("events").doc(eventId).get()
      .then(doc => doc.data())
      .then((serializedEvent: any) => setEvent({
        _id: serializedEvent._id,
        name: serializedEvent.name,
        timeSlots: serializedEvent.timeSlots.map(deserializeTimeSlot),
      }))
    
    return () => unsubscribe();
  }, [])

  const onTimeSlotUpdate = (updatedTimeSlot: TimeSlot) : void => {
    if (event === undefined) return;

    const updatedTimeSlots = event.timeSlots.map(t => 
      (t._id === updatedTimeSlot._id) ? updatedTimeSlot : t 
    ) 

    db.collection("events").doc(eventId).update({
      timeSlots: updatedTimeSlots.map(serializeTimeSlot)
    })

    setEvent({...event, timeSlots: updatedTimeSlots})
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
