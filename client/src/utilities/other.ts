import { ITimezone } from "react-timezone-select";
import { getTimezone } from "countries-and-timezones"

import { DateRange, Time, RangeBlockBox, RangeBlock, TimeSlot, CalendarDate } from "../types";
import { getAbsMinutesFromDate, dateInRange } from "../utilities";
import { MINUTES_PER_CELL, MILLISECONDS_PER_HOUR, CELLS_PER_DAY } from "../constants";
import { getCalendarDate, getDateFromCalendarDate, getDateInDays } from "./dates";

const serializeDateRanges = (dateRanges: DateRange[]) : string => {
  return JSON.stringify(dateRanges);
}

const deserializeDateRanges = (value: any) : DateRange[] => {
  const dateRangesAsStrings = JSON.parse(value);

  const dateRanges: DateRange[] = []
  for (let dateRangeString of dateRangesAsStrings) {
    dateRanges.push({
      startDate: new Date(dateRangeString.startDate),
      endDate: new Date(dateRangeString.endDate),
    })
  }

  return dateRanges;
} 

const clone = (dataToClone: any) : any => {
  return JSON.parse(JSON.stringify(dataToClone))
}

const getTimezoneString = (timezone: ITimezone) : string => {
  return typeof(timezone) === "string" ? timezone : timezone.value;
}


const getRangeBlocksFromDateRanges = (dateRanges: DateRange[]) : RangeBlock[] => {
  return dateRanges
    .map(dateRange => getRangeBlockFromDateRange(dateRange))
    .filter(dateRange => dateRange !== undefined) as RangeBlock[];
}

// assumes the current 
const getRangeBlockFromDateRange = (dateRange: DateRange) : RangeBlock => {
  return {
    bRow: Math.round(getAbsMinutesFromDate(dateRange.startDate) / MINUTES_PER_CELL),
    tRow: Math.round(getAbsMinutesFromDate(dateRange.endDate) / MINUTES_PER_CELL)
  }
}

// https://dmitripavlutin.com/how-to-compare-objects-in-javascript/
const deepEqual = (object1: any, object2: any) : boolean => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }
  return true;
}

const isObject = (object: any) : boolean => {
  return object != null && typeof object === 'object';
}

const computeHourFrom24Hour = (totalHours: number) : number => {
  if (totalHours === 0)
    return 12
  if (totalHours > 12) 
    return totalHours - 12
  return totalHours
}

const getTimeFromRow = (row: number) : Time => {
  let minutes: number = row * 15;
  if (minutes === 24 * 60)
    --minutes;

  let totalHours = Math.floor(minutes / 60)
  let hour = computeHourFrom24Hour(totalHours);
  let minute = minutes % 60
  let am = totalHours < 12

  return { hour, minute, am };
}

const copy = (text: string) : void => { navigator.clipboard.writeText(text) }


const getDateRangesInRange = (startDate: Date, endDate: Date, dateRanges: DateRange[]) : DateRange[] => {
  return dateRanges
    .filter(dateRange => dateInRange(dateRange.startDate, startDate, endDate))
}

const applyOffsetToDate = (date: Date, offset: number) : Date => {
  return new Date(date.getTime() + offset * MILLISECONDS_PER_HOUR);
}

// NOTE: In hours
const getTimezoneOffset = (timezone: string) : number => {
  const data = getTimezone(timezone)
  if (data === null) return 0

  return Math.round(data.utcOffset / 60)
}

const convertToUTC = (localDate: Date, timezone: string) : Date => {
  const offset = getTimezoneOffset(timezone);
  return applyOffsetToDate(localDate, -1 * offset);
}

const convertToTimezone = (utcDate: Date, timezone: string) : Date => {
  const offset = getTimezoneOffset(timezone);
  return applyOffsetToDate(utcDate, offset);
}

export const convertTimeSlotsToTimezone = (utcTimeSlots: TimeSlot[], timezone: string) : TimeSlot[] => {
  return utcTimeSlots.map(timeSlot => convertTimeSlotToTimezone(timeSlot, timezone)).flat()
}

export const convertTimeSlotsToUTC = (localTimeSlots: TimeSlot[], timezone: string) : TimeSlot[] => {
  return localTimeSlots.map(timeSlot => convertTimeSlotToUTC(timeSlot, timezone)).flat()
}

// UTC -> Timezone
export const convertTimeSlotToTimezone = (utcTimeSlot: TimeSlot, timezone: string) : TimeSlot[] => {
  const offset = getTimezoneOffset(timezone);
  const rowShifts = offset * 4; 

  if (rowShifts < 0) {
    return moveTimeSlotBackward(utcTimeSlot, Math.abs(rowShifts))
  }
  return moveTimeSlotForward(utcTimeSlot, Math.abs(rowShifts))
}

// Timezone -> UTC
export const convertTimeSlotToUTC = (localTimeSlot: TimeSlot, timezone: string) : TimeSlot[] => {
  const offset = getTimezoneOffset(timezone) * -1;
  const rowShifts = offset * 4; 

  if (rowShifts < 0) {
    return moveTimeSlotBackward(localTimeSlot, Math.abs(rowShifts))
  } 
  return moveTimeSlotForward(localTimeSlot, Math.abs(rowShifts))
}

const moveTimeSlotBackward = (timeSlot: TimeSlot, rows: number) : TimeSlot[] => {
  let moveDayBackward = (timeSlot.topRow - rows) < 0
  let timeSlotRows = (timeSlot.topRow - timeSlot.bottomRow + 1)

  let updatedBottomRow = (timeSlot.bottomRow - rows + CELLS_PER_DAY) % CELLS_PER_DAY;
  let updatedTopRow = (timeSlot.topRow - rows + CELLS_PER_DAY) % CELLS_PER_DAY;

  let result: TimeSlot[] = []

  let updatedAvailability = new Array(CELLS_PER_DAY).fill(0).map(i => new Array())
    for (let row = 0; row < CELLS_PER_DAY; ++row) {
      let updatedRow = (row - rows + CELLS_PER_DAY) % CELLS_PER_DAY
      updatedAvailability[updatedRow].push(...timeSlot.availability[row])
    }

  if (updatedTopRow - updatedBottomRow + 1 !== timeSlotRows) {
    // split time slot
    result.push({
      _id: timeSlot._id,
      bottomRow: updatedBottomRow,
      topRow: CELLS_PER_DAY - 1,
      date: timeSlot.date, 
      availability: getAvailability(updatedBottomRow, CELLS_PER_DAY - 1, updatedAvailability) 
    })

    // IDS match!
    result.push({
      _id: timeSlot._id + "-Z",
      bottomRow: 0,
      topRow: updatedTopRow, 
      date: getCalendarDateYesterday(timeSlot.date), 
      availability: getAvailability(0, updatedTopRow, updatedAvailability) 
    })
  } else {
    result.push({
      _id: timeSlot._id,
      bottomRow: updatedBottomRow,
      topRow: updatedTopRow,
      date: moveDayBackward ? getCalendarDateYesterday(timeSlot.date) : timeSlot.date,
      availability: updatedAvailability 
    })
  }

  return result; 
}

const moveTimeSlotForward = (timeSlot: TimeSlot, rows: number) : TimeSlot[] => {
  let moveDayForward = (timeSlot.topRow + rows) >= CELLS_PER_DAY
  let timeSlotRows = (timeSlot.topRow - timeSlot.bottomRow + 1)

  let updatedBottomRow = (timeSlot.bottomRow + rows) % CELLS_PER_DAY;
  let updatedTopRow = (timeSlot.topRow + rows) % CELLS_PER_DAY;

  let result: TimeSlot[] = []

  let updatedAvailability: Array<Array<string>> = new Array(CELLS_PER_DAY).fill(0).map(i => new Array())
  for (let row = 0; row < CELLS_PER_DAY; ++row) {
    let updatedRow = (row + rows) % CELLS_PER_DAY
    updatedAvailability[updatedRow].push(...timeSlot.availability[row])
  }

  if (updatedTopRow - updatedBottomRow + 1 !== timeSlotRows) {
    // split time slot
    result.push({
      _id: timeSlot._id,
      bottomRow: updatedBottomRow,
      topRow: CELLS_PER_DAY - 1,
      date: timeSlot.date, 
      availability: getAvailability(updatedBottomRow, CELLS_PER_DAY - 1, updatedAvailability) 
    })

    // IDS match!
    result.push({
      _id: timeSlot._id + "-Z",
      bottomRow: 0,
      topRow: updatedTopRow, 
      date: getCalendarDateTomorrow(timeSlot.date), 
      availability: getAvailability(0, updatedTopRow, updatedAvailability) 
    })
  } else {
    result.push({
      _id: timeSlot._id,
      bottomRow: updatedBottomRow,
      topRow: updatedTopRow,
      date: moveDayForward ? getCalendarDateTomorrow(timeSlot.date) : timeSlot.date,
      availability: updatedAvailability 
    })
  }

  return result;
}

const getCalendarDateTomorrow = (calendarDate: CalendarDate) : CalendarDate => {
  return getCalendarDate(getDateInDays(1, getDateFromCalendarDate(calendarDate)))
}

const getCalendarDateYesterday = (calendarDate: CalendarDate) : CalendarDate => {
  return getCalendarDate(getDateInDays(-1, getDateFromCalendarDate(calendarDate)))
}

const getAvailability = (bottomRow: number, topRow: number, availability: Array<Array<string>>) : Array<Array<string>> => {
  let updatedAvailability = new Array(CELLS_PER_DAY).fill(0).map(i => new Array())
  for (let row = bottomRow; row <= topRow; ++row)
    updatedAvailability[row].push(...availability[row])
  
  return updatedAvailability
}

export { 
  serializeDateRanges, 
  deserializeDateRanges, 
  getTimezoneString,
  getRangeBlocksFromDateRanges,
  getRangeBlockFromDateRange,
  deepEqual,
  getTimeFromRow,
  copy,
  getDateRangesInRange,
  convertToUTC,
  convertToTimezone,
  clone
}
