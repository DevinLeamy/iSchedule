export type DateRange = {
  startMinute: number,
  endMinute: number, 
  month: number,
  day: number,
  year: number,
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

export type Event = {
  dateRanges: DateRange[],
  userIds: string[] 
}
