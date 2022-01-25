import { Event, ResponseT } from "../types";

const BASE_URL = "http://localhost:3000";

const getEventById = async (_id: string) : Promise<Event | undefined> => {
  let rawRes = await fetch(`${BASE_URL}/event/${_id}`);
  let res: ResponseT = await rawRes.json();

  if (res.status === 0) {
    // GOOD
    return res.data as Event;
  }

  alert("Failed to fetch the event by id")
  return undefined;
}


export { getEventById }
