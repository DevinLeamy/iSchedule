import { DateRange } from "../types";

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

export { serializeDateRanges, deserializeDateRanges }