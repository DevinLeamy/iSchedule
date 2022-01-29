export type DateRange = {
  startDate: Date,
  endDate: Date,
  timezone: string
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
  dateRanges: DateRange[]
}

export type Event = {
  _id: string,
  name: string,
  dateRanges: DateRange[],
  timezone: string,
  members: Member[]
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

export type MemberRangeBlockBox = RangeBlockBox | {
  name: string
}

export type MemberRangeBlock = RangeBlock | {
  name: string
}

export type MemberDateRange = DateRange | {
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
