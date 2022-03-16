import { db } from "./config";
import { Message, TimeSlot } from "../types"

export const generateDocId = (collection: string) : string => {
  return db.collection(collection).doc().id;
}

export const deserializeTimeSlot = (serializedEvent: any) : TimeSlot => {
  return {
    _id: serializedEvent._id,
    bottomRow: serializedEvent.bottomRow,
    topRow: serializedEvent.topRow,
    date: serializedEvent.date,
    availability: JSON.parse(serializedEvent.availability)
  }
}

export const serializeTimeSlot = (timeSlot: TimeSlot) : any => {
  return {
    _id: timeSlot._id,
    bottomRow: timeSlot.bottomRow,
    topRow: timeSlot.topRow,
    date: timeSlot.date,
    availability: JSON.stringify(timeSlot.availability)
  }
}

export const serializeMessage = (message: Message) : any => {
  return {
    datetime: message.datetime.toUTCString(),
    message: message.message,
    sender: message.sender,
  }
}

export const deserializeMessage = (serializedMessage: any) : Message => {
  return {
    datetime: new Date(serializedMessage.datetime),
    message: serializedMessage.message,
    sender: serializedMessage.sender
  }
}
