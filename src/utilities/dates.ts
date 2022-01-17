import { AbsTime, Time } from "../types/types"

const MONTHS = [
  { name: "January",   monthIndex: 0,  days: 31 }, 
  { name: "February",  monthIndex: 1,  days: 28 }, 
  { name: "March",     monthIndex: 2,  days: 31 }, 
  { name: "April",     monthIndex: 3,  days: 30 }, 
  { name: "May",       monthIndex: 4,  days: 31 }, 
  { name: "June",      monthIndex: 5,  days: 30 }, 
  { name: "July",      monthIndex: 6,  days: 31 }, 
  { name: "August",    monthIndex: 7,  days: 31 }, 
  { name: "September", monthIndex: 8,  days: 30 }, 
  { name: "October",   monthIndex: 9,  days: 31 }, 
  { name: "November",  monthIndex: 10, days: 30 }, 
  { name: "December",  monthIndex: 11, days: 31 }
]

const WEEKDAYS = [
  { name: "Monday",    weekdayIndex: 0 },
  { name: "Tuesday",   weekdayIndex: 0 },
  { name: "Wednesday", weekdayIndex: 0 },
  { name: "Thursday",  weekdayIndex: 0 },
  { name: "Friday",    weekdayIndex: 0 },
  { name: "Saturday",  weekdayIndex: 0 },
  { name: "Sunday",    weekdayIndex: 0 }
]

export type SDate = {
  month: string,
  day: string,
  weekday: string
}

const getSDate = (date: Date) : SDate => {
  let month = MONTHS[date.getMonth()].name
  let day = `${date.getDate()}`
  let weekday = WEEKDAYS[date.getDay()].name

  return { month, day, weekday };
}

const getDateInDays = (days: number, currentDate: Date = new Date()) : Date => {
  let newDate = new Date(currentDate.getTime())
  newDate.setDate(newDate.getDate() + days)

  return newDate;
}

const minToAbsTime = (minute: number) : AbsTime => {
  return {
    hour: Math.floor(minute / 60),
    minute: minute % 60
  }
}


const computeHourFrom24Hour = (totalHours: number) : number => {
  if (totalHours === 0) return 12
  if (totalHours > 12) return totalHours - 12
  return totalHours
}

const absTimeToTime = (absTime: AbsTime) : Time => {
  return {
    hour: computeHourFrom24Hour(absTime.hour),
    minute: absTime.minute, 
    am: absTime.hour < 12
  };
}

const minToTime = (minutes: number) : Time => {
  return absTimeToTime(minToAbsTime(minutes));
}

const dateInRange = (date: Date, rangeLow: Date, rangeHigh: Date) : boolean => {
  return (rangeLow.getTime() <= date.getTime() && date.getTime() <= rangeHigh.getTime());
}

export { getSDate, getDateInDays, absTimeToTime, minToAbsTime, minToTime, dateInRange }
