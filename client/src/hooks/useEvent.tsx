import { useEffect, useState } from "react";

import { db, serializeTimeSlot, deserializeTimeSlot } from "../firebase";
import { Event, TimeSlot } from "../types";
import { clone, convertTimeSlotsToUTC } from "../utilities";

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
          timeSlots: serializedEvent.timeSlots.map(deserializeTimeSlot)
        })
      })

    // initialize event state
    db.collection("events").doc(eventId).get()
      .then(doc => doc.data())
      .then((serializedEvent: any) => {
        setEvent({
          _id: serializedEvent._id,
          name: serializedEvent.name,
          timeSlots: serializedEvent.timeSlots.map(deserializeTimeSlot) 
        })
      })
    
    return () => unsubscribe();
  }, [])

  // local timezone time slot
  const onTimeSlotUpdate = (updatedTimeSlot: TimeSlot) : void => {
    if (event === undefined) return;

    let utcTimeSlot = convertTimeSlotsToUTC([updatedTimeSlot], localTimezone)

    const updatedTimeSlots = event.timeSlots.map(t => 
      (t._id === updatedTimeSlot._id) ? updatedTimeSlot : t 
    ) 

    db.collection("events").doc(eventId).update({
      timeSlots: convertTimeSlotsToUTC(updatedTimeSlots.map(serializeTimeSlot), localTimezone)
    })

    setEvent({...event, timeSlots: updatedTimeSlots})
  }

  // UTC event
  return [event, onTimeSlotUpdate];
}

export { useEvent };
