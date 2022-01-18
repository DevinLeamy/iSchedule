import { Schema, model } from "mongoose";

interface DateRange {
  startDate: Date,
  endDate: Date,
  timezone: string
}

// interface representing a document in MongoDB
interface Event {
  id: string,
  dateRanges: DateRange[],
  userIds: string[]
}

// Schema corresponsing to the document interface
const EventSchema = new Schema<Event>({
  id: { type: Schema.Types.ObjectId, required: true },
  startDates: [{ type: Date, required: true }],
  endDates: [{ type: Date, required: true }],
  timezone: { type: String, required: true },
  userIds: [Schema.Types.ObjectId]
})

// Create a model
const EventModel = model<Event>('Event', EventSchema)
