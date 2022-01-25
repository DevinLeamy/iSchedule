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

export type User = {
  id: string,
  name: string,
  timezone: string,
  ranges: DateRange[]
}

export type PreEvent = {
  dateRanges: DateRange[],
  userIds: string[] 
}

export type Event = {
  _id: string,
  name: string,
  dateRanges: DateRange[],
  timezone: string,
  userIds: string[]
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
