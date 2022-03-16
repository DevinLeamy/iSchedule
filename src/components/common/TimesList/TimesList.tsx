import React, { CSSProperties as CSS } from "react";

import { List } from "..";
import { MINUTES_PER_DAY, MINUTES_PER_CELL } from "../../../constants";
import { getTimeFromRow } from "../../../utilities";
import { Time } from "../../../types";

import "./TimesList.css";

// TODO: make a lot of lists

interface TimesListProps {
  minMinutes?: number,
  maxMinutes?: number,
  containerStyle?: CSS
  dateStyle?: CSS
}

const TimesList: React.FC<TimesListProps> = ({
  minMinutes = 0,
  maxMinutes = MINUTES_PER_DAY,
  containerStyle = {},
  dateStyle = {}
}) => {
  const rows = Array.from(Array(minutesToRow(MINUTES_PER_DAY)).keys()).filter(row =>
    row >= minutesToRow(minMinutes) &&
    row < minutesToRow(maxMinutes)
  );

  const mapRowToDate = (row: number) : React.ReactNode => {
    let dateString = ""
    if (row % 4 === 0 && row !== minutesToRow(MINUTES_PER_DAY) && row !== 0)
      dateString = getStringFromTime(getTimeFromRow(row))

    return (
      <div className="calendar-date" style={dateStyle}>
        {dateString}
      </div> 
    )
  }

  const mapRowToKey = (row: number) : number => row;

  return (
    <div className="calendar-dates" style={containerStyle}>
      <div style={{position: "absolute"}}>
        <List
          items={rows}
          listKeyMap={mapRowToKey}
          listItemMap={mapRowToDate}
        />
      </div>
    </div>
  )
}

const formatMinute = (minute: number) : string => {
  return (minute < 10) ? `0${minute}` : `${minute}`
}

const getStringFromTime = (time: Time) : string => {
  let zone = time.am ? 'AM' : 'PM'
  if (time.minute === 0) 
    return `${time.hour} ${zone}`

  return `${time.hour}:${formatMinute(time.minute)} ${zone}`;
}

const minutesToRow = (minute: number) => Math.round(minute / MINUTES_PER_CELL)

export { TimesList }
