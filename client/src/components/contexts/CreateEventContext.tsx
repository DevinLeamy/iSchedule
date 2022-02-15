import React, { useContext, useState, Dispatch } from "react";
import { useNavigate } from "react-router-dom";

import { Event, TimeSlot, CalendarDate } from "../../types";
import { useTimezone, usePersistedValue } from "../../hooks";
import { db, serializeTimeSlot, generateDocId } from "../../firebase"
import { ITimezone } from "react-timezone-select/dist";
import { CELLS_PER_DAY } from "../../constants";
import { clone, deepEqual, getTimezoneString, convertTimeSlotsToUTC } from "../../utilities";


interface EventContextI {
  setTimeSlots: Dispatch<TimeSlot[]>,
  setEventName: Dispatch<string>,
  setTimezone: Dispatch<ITimezone>,

  cellHeight: number,
  cellWidth: number,

  timezone: ITimezone,
  eventName: string,
  timeSlots: TimeSlot[],

  onCreateEvent: () => void,
  onCreateTimeSlot: (bottomRow: number, heightInCells: number, date: CalendarDate) => void,
  onDeleteTimeSlot: (timeSlot: TimeSlot) => void,
  onUpdateTimeSlot: (timeSlot: TimeSlot) => void
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

  const eventsRef = db.collection('events')

 const onCreateEvent = async () : Promise<void> => {
    if (eventName === "" || timeSlots.length === 0) {
      alert("event data is incomplete");
      return;
    }

    // TODO: Convert timeslots to UTC

    const uid = generateDocId("events") 
    const utcTimeSlots = convertTimeSlotsToUTC(timeSlots, getTimezoneString(timezone))

    await eventsRef.doc(uid).set({
      _id: uid,
      name: eventName,
      timeSlots: utcTimeSlots.map(serializeTimeSlot)
    })

    // reset data
    setEventName("")
    setTimeSlots([])

    navigate(`/event/${uid}`);
  }

  // TODO: There is a bug where if you resize up and merge
  //       with another block, the lower block will disappear.

  const onCreateTimeSlot = (bottomRow: number, heightInCells: number, date: CalendarDate) => {
    heightInCells = Math.max(heightInCells, 3)

    let newTimeSlot: TimeSlot = {
      _id: String(Math.random()),
      bottomRow: bottomRow,
      topRow: bottomRow + heightInCells,
      date: date,
      availability: new Array(CELLS_PER_DAY).fill([])
    }

    const updatedTimeSlots = [...timeSlots, newTimeSlot]

    const timeSlotsOnDate = updatedTimeSlots.filter(t => deepEqual(t.date, date))
    const timeSlotsNotOnDate = updatedTimeSlots.filter(t => !deepEqual(t.date, date))
    setTimeSlots([...timeSlotsNotOnDate, ...mergeTimeSlotsOnDate(timeSlotsOnDate)])
  }

  const onDeleteTimeSlot = (timeSlot: TimeSlot) => {
    setTimeSlots(timeSlots.filter(t => t._id !== timeSlot._id))
  }

  const onUpdateTimeSlot = (timeSlot: TimeSlot) => {
    const updatedTimeSlots = timeSlots.map(t => t._id === timeSlot._id ? timeSlot : t)

    const timeSlotsOnDate = updatedTimeSlots.filter(t => deepEqual(t.date, timeSlot.date))
    const timeSlotsNotOnDate = updatedTimeSlots.filter(t => !deepEqual(t.date, timeSlot.date))
    setTimeSlots([...timeSlotsNotOnDate, ...mergeTimeSlotsOnDate(timeSlotsOnDate)])
  }

  const mergeTimeSlotsOnDate = (timeSlots: TimeSlot[]) : TimeSlot[] => {
    timeSlots.sort((t1, t2) => t1.bottomRow - t2.bottomRow)

    const slotAvailabilities: Array<Array<string>> = new Array(CELLS_PER_DAY).fill(0).map(i => [])
    const occupied: Array<Array<string>> = new Array(CELLS_PER_DAY).fill(0).map(i => [])

    // NOTE: all time slot dates match
    const date: CalendarDate = timeSlots[0].date

    for (let timeSlot of timeSlots) {
      for (let i = timeSlot.bottomRow; i <= timeSlot.topRow; ++i) {
        slotAvailabilities[i].push(...timeSlot.availability[i]);
        occupied[i].push(timeSlot._id);
      }
    }

    let newTimeSlots: TimeSlot[] = []

    for (let i = 0; i < CELLS_PER_DAY; ++i) {
      let occupants: Array<string> = slotAvailabilities[i]

      if (occupied[i].length > 0) {
        if (newTimeSlots.length === 0 || newTimeSlots[newTimeSlots.length - 1].topRow !== i - 1) {
          newTimeSlots.push({
            _id: occupied[i][0],
            bottomRow: i,
            topRow: i,
            date: clone(date),
            availability: new Array(CELLS_PER_DAY).fill([])
          })
        }
        let lastI = newTimeSlots.length - 1

        newTimeSlots[lastI].topRow = i; 

        for (let member of occupants) {
          if (newTimeSlots[lastI].availability[i].indexOf(member) === -1)
            newTimeSlots[lastI].availability[i].push(member)
        }
      }
    }

    return newTimeSlots;
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

        onCreateEvent,
        onCreateTimeSlot,
        onDeleteTimeSlot,
        onUpdateTimeSlot
      }}
    >
      {children}
    </CreateEventContext.Provider> 
  )
}

export { CreateEventContext, CreateEventContextProvider }
