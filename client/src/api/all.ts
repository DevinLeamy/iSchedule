import { Event, DateRange, ResponseT, Member } from "../types";

const BASE_URL = "http://localhost:3000";

const fakeData = `{
  "_id":"61f2f2ac7a42f6ef56144235",
  "name":"Test",
  "dateRanges": [
    {"startDate":"2022-01-26T10:15:00.000Z","endDate":"2022-01-26T12:00:00.000Z","_id":"61f2f2ac7a42f6ef56144236"},
    {"startDate":"2022-01-27T12:30:00.000Z","endDate":"2022-01-27T13:45:00.000Z","_id":"61f2f2ac7a42f6ef56144237"},
    {"startDate":"2022-01-28T12:00:00.000Z","endDate":"2022-01-28T12:45:00.000Z","_id":"61f2f2ac7a42f6ef56144238"},
    {"startDate":"2022-01-29T10:15:00.000Z","endDate":"2022-01-29T14:45:00.000Z","_id":"61f2f2ac7a42f6ef56144239"},
    {"startDate":"2022-02-08T08:30:00.000Z","endDate":"2022-02-08T10:15:00.000Z","_id":"61f2f2ac7a42f6ef56144241"}],
    "timezone":"America/Edmonton",
    "members": [
      {"name":"TestMember","dateRanges":[],"timezone":"America/Edmonton","_id":"61f2f45e6268b24fd81b055e"},
      {"name":"TestMember2","dateRanges":[],"timezone":"America/Edmonton","_id":"61f302d5fce74b6e453b126a"},
      {"name":"TestMember23","dateRanges":[],"timezone":"America/Edmonton","_id":"61f303002c9167a9cdc598a3"}
    ]
  }`


const getEventById = async (_id: string) : Promise<Event | undefined> => {
  let data = JSON.parse(fakeData);
  let mapDateRange = (stringDateRange: any) : DateRange => {
    return {
      startDate: new Date(stringDateRange.startDate),
      endDate: new Date(stringDateRange.endDate),
      timezone: stringDateRange.timezone
    }
  }

  data.dateRanges = [...data.dateRanges].map(mapDateRange)
  return data;
}


// const getEventById = async (_id: string) : Promise<Event | undefined> => {
//   let rawRes = await fetch(`${BASE_URL}/events/${_id}`);
//   let res: ResponseT = await rawRes.json();

//   if (res.status === 0) {
//     // GOOD
//     return res.data as Event;
//   }

//   alert("Failed to fetch the event by id")
//   return undefined;
// }

const createEvent = async (name: string, dateRanges: DateRange[], timezone: string) : Promise<undefined | string> => {
  let rawRes = await fetch(`${BASE_URL}/events/create`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      dateRanges: dateRanges,
      timezone: timezone
    })
  })
  let res: ResponseT = await rawRes.json();

  if (res.status === 0) {
    // GOOD
    return res.data._id as string;
  }

  alert("Failed to create a new event");
  return undefined;
}

const getEventMember = async (name: string, eventId: string) : Promise<Member | undefined> => {
  let rawRes = await fetch(`${BASE_URL}/events/${eventId}/members/${name}`);
  let res: ResponseT = await rawRes.json(); 

  if (res.status === 0) {
    // GOOD
    console.log(res.data);
    return res.data as Member;
  }

  alert("Failed to fetch user");
  return undefined
}


export { getEventById, getEventMember, createEvent }
