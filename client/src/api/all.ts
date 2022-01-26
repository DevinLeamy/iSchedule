import { Event, DateRange, ResponseT, Member } from "../types";

const BASE_URL = "http://localhost:3000";

const getEventById = async (_id: string) : Promise<Event | undefined> => {
  let rawRes = await fetch(`${BASE_URL}/events/${_id}`);
  let res: ResponseT = await rawRes.json();

  if (res.status === 0) {
    // GOOD
    return res.data as Event;
  }

  alert("Failed to fetch the event by id")
  return undefined;
}

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
