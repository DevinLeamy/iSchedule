import { useEffect, useState } from "react";
import { CELLS_PER_DAY } from "../constants";

import { db, serializeTimeSlot, deserializeTimeSlot } from "../firebase";
import { Event, TimeSlot } from "../types";
import { clone, convertTimeSlotsToUTC } from "../utilities";

/*
TODO: Added database updates and timezone conversions
*/

const useEvent = (eventId?: string) : [
  Event | undefined,
  (timeSlot: TimeSlot, timezone: string) => void
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
  const onTimeSlotUpdate = (updatedTimeSlot: TimeSlot, timezone: string) : void => {
    // TODO: might need to update and merge all time slots
    if (event === undefined) return;

    let utcTimeSlot = convertTimeSlotsToUTC([updatedTimeSlot], timezone)

    const updatedTimeSlots = event.timeSlots.map(t => 
      (t._id === updatedTimeSlot._id) ? utcTimeSlot : [t]
    ).flat()

    db.collection("events").doc(eventId).update({
      timeSlots: updatedTimeSlots.map(serializeTimeSlot)
    })

    setEvent({...event, timeSlots: updatedTimeSlots})
  }


// UTC event
 return [event, onTimeSlotUpdate];
}

export { useEvent };
