import { ITimezone } from "react-timezone-select";

import { DateRange, Time, RangeBlockBox, RangeBlock } from "../types";
import { getAbsMinutesFromDate } from "../utilities";
import { MINUTES_PER_CELL } from "../constants";

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
      timezone: dateRangeString.timezone
    })
  }

  return dateRanges;
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


export { 
  serializeDateRanges, 
  deserializeDateRanges, 
  getTimezoneString,
  getRangeBlocksFromDateRanges,
  getRangeBlockFromDateRange,
  deepEqual,
  getTimeFromRow
}
