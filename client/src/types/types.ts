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
