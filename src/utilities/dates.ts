import type { Month, Date } from "../types/types";

const MONTHS: Month[] = [
  { name: "January",  monthIndex: 0,  days: 31 }, 
  { name: "February", monthIndex: 1,  days: 28 }, 
  { name: "March",    monthIndex: 2,  days: 31 }, 
  { name: "April",    monthIndex: 3,  days: 30 }, 
  { name: "May",      monthIndex: 4,  days: 31 }, 
  { name: "June",     monthIndex: 5,  days: 30 }, 
  { name: "July",     monthIndex: 6,  days: 31 }, 
  { name: "August",   monthIndex: 7,  days: 31 }, 
  { name: "September",monthIndex: 8,  days: 30 }, 
  { name: "October",  monthIndex: 9,  days: 31 }, 
  { name: "November", monthIndex: 10, days: 30 }, 
  { name: "December", monthIndex: 11, days: 31 }
]

const getDate = (inDays: number = 0) : Date => {
  let now = new Date(); 
  now.setDate(now.getDate() + inDays);
  
  const day: number = now.getDate();
  const month: number = now.getMonth();
  // add year later

  return { day, month: MONTHS[month] };
}

const formatDate = (date: Date, shorthand: boolean = false) => {
  if (shorthand)
    return `${date.month.name.slice(0, 3)} ${date.day}`;

  return `${date.month.name} ${date.day}`;
}

const getNextDate = (currentDate: Date, daysFromCurrent: number = 1) : Date => {
  let now = new Date(2022, currentDate.month.monthIndex, currentDate.day); 
  now.setDate(now.getDate() + daysFromCurrent);
  
  const day: number = now.getDate();
  const month: number = now.getMonth();
  // add year later

  return { day, month: MONTHS[month] };
}

export { getDate, getNextDate, formatDate };
