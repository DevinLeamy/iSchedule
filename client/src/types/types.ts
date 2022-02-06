export type DateRange = {
  startDate: Date,
  endDate: Date,
};

export type AbsTime = {
  hour: number,
  minute: number
};

export type Time = {
  hour: number,
  minute: number,
  am: boolean
};

export type Size = {
  width: number,
  height: number
};

export type Member = {
  name: string,
  timezone: string,
  dateRanges: MemberDateRange[]
}

export type TimeSlot = {
  _id: string,
  bottomRow: number,
  topRow: number,
  date: CalendarDate,
  availability: Array<Array<string>>
}

export type Event = {
  _id: string,
  name: string,
  timeSlots: TimeSlot[] // UTC
}

export interface ResponseT {
  status: 0 | 1,
  data?: any,
  message?: string
}

export type Position = {
  row: number,
  col: number
}

export type RangeBlockBox = {
  _id?: string,
  bRow: number,
  tRow: number,
  col: number
}

export type RangeBlock = {
  bRow: number,
  tRow: number
}

export type CalendarDate = {
  year: number,
  month: number,
  day: number
}

export type MemberRangeBlockBox = RangeBlockBox & {
  name: string
}

export type MemberRangeBlock = RangeBlock & {
  name: string
}

export type MemberDateRange = DateRange & {
  name: string
}

// Could refactor events to be
/*
export type Event = {
 _id: string,
  name: string,

  // event timezone is in DateRange
  dateRanges: DateRange[],             

  // individual member timezone is in a MemberDateRange
  memberDateRanges: MemberDateRange[] 
}

*/
