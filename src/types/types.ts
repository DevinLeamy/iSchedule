type Month = {
  name: string,
  monthIndex: number,
  days: number
};

type Date = {
  day: number,
  month: Month  
};

type Time = {
  hour: number, // 24 hours
  minute: number 
};

type DateTime = {
  date: Date,
  time: Time
};

type DateTimeRange = {
  startDateTime: DateTime,
  endDateTime: DateTime
};

export type { DateTime, Date, Time, Month, DateTimeRange };
