import { Schema, model, ObjectId, HydratedDocument } from "mongoose";

interface DateRange {
  startDate: Date,
  endDate: Date,
  timezone: string
}

// interface representing a document in MongoDB
interface Event {
  _id: ObjectId,
  dateRanges: DateRange[],
  timezone: string,
  userIds: string[]
}

// Schema corresponsing to the document interface
const EventSchema = new Schema<Event>({
  // _id: { type: Schema.Types.ObjectId, required: true },
  dateRanges: [{
    start: { type: Date, required: true },
    endDate: { type: Date, required: true },
  }],
  timezone: { type: String, required: true },
  userIds: [{ type: Schema.Types.ObjectId }]
})

// Create a model
const EventModel = model<Event>('Event', EventSchema)

export { Event, EventSchema, EventModel };

// // Using an instance (a document)
// const myEvent: HydratedDocument<Event> = new EventModel({
//   dateRanges: [],
//   timezone: "America/Edmonton",
//   userIds: []
// });

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
