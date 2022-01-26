import { Schema, model, ObjectId, HydratedDocument } from "mongoose";
import { Event, Member } from "../types";

// Schema corresponsing to the document interface
const EventSchema = new Schema<Event>({
  // _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String },
  dateRanges: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  }],
  timezone: { type: String, required: true },
  members: [{
    // Member type
    name: { type: String, required: true },
    dateRanges: [{
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    }],
    timezone: { type: String, required: true }
  }]
})


// Create a model
const EventModel = model<Event>('Event', EventSchema)

EventSchema.methods.getEventMember = function (eventId: string, memberName: string) {
  return EventModel.findOne({ _id: eventId })
                   .select({ members: {$elemMatch: {name: memberName}}})
}


// type EventModelType = typeof myEvent;

// const saveMyEvent = async (event: EventModelType) => {
//   await event.save();
// }

// saveMyEvent(myEvent);

// // Define custom built-in instance methods
// // NOTE: do not use ES6. It does not allow access the 'this'
// EventSchema.methods.findSimilarTypes = function (cb: any) { 
//   return model('Event').find({ type: this.type }, cb)
// }

export { Event, EventSchema, EventModel };
