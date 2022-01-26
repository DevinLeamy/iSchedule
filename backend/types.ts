import { ObjectId } from "mongoose";

interface ResponseT {
  status: 0 | 1,
  data?: any,
  message?: string
}

interface DateRange {
  startDate: Date,
  endDate: Date,
  timezone: string
}

interface Member {
  name: string,
  timezone: string,
  dateRanges: DateRange[]
}

// interface representing a document in MongoDB
interface Event {
  _id: ObjectId,
  name: string,
  dateRanges: DateRange[],
  timezone: string,
  members: Member[]
}

export type { ResponseT, DateRange, Event, Member }
