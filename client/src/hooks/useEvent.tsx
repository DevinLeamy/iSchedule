import { useEffect, useState } from "react";

import { getEventById } from "../api";
import { Event, DateRange, MemberDateRange } from "../types";

const useEvent = (eventId?: string) : [string, DateRange[], MemberDateRange[]] => {
  const [event, setEvent] = useState<Event | undefined>(undefined)

  useEffect(() => {
    if (event === undefined) {
      getEventById(eventId ?? "")
        .then(event => setEvent(event))
    }
  }, [])


  const getMemberDateRanges = (event: Event) : MemberDateRange[] => {
    let memberDateRanges: MemberDateRange[] = []

    event.members.forEach(member => memberDateRanges.push(...member.dateRanges));

    return memberDateRanges;
  }

  if (event === undefined)
    return [ "Loading...", [], [] ]
  
  return [event.name, event.dateRanges, getMemberDateRanges(event)];
}

export { useEvent };
