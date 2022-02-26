import React, { useState, useContext } from "react";
import classNames from "classnames";
import { Chip, Avatar } from "@mui/material";

import { EventContext } from "../../contexts";
import { generateRandomColor } from "../../../utilities";

import "./EventRespondents.css";
import { Respondent } from "../../../types";

const EventRespondents: React.FC = ({}) => {
  const { respondents, member, selectedRespondents, setSelectedRespondents } =
    useContext(EventContext);

  const toggleRespondent = (respondent: Respondent): void => {
    let remove = selectedRespondents.includes(respondent.name);
    let updated = selectedRespondents.filter((m) => m !== respondent.name);

    if (!remove) {
      updated.push(respondent.name);
    }

    setSelectedRespondents(updated);
  };

  const selectAll = (): void => {
    setSelectedRespondents(respondents.map(r => r.name));
  };

  const mapRespondent = (respondent: Respondent): React.ReactNode => {
    const selected = selectedRespondents.includes(respondent.name);

    return (
      <div
        className={classNames(
          "res",
          "hoverable"
        )}
        onClick={(e) => toggleRespondent(respondent)}
      >
        <Chip
          sx={{ height: 40 }}
          avatar={
            <Avatar
              sx={{
                bgcolor: selected ? respondent.color : 'inherit',
                height: "32px !important",
                width: "32px !important",
                fontSize: "17px !important",
                color: "white !important",
              }}
            >
              {respondent.name.slice(0, 2)}
            </Avatar>
          }
          label={respondent.name}

          variant={selected ? "outlined" : 'filled'}
        />
      </div>
    );
  };

  const renderFilled = (
    selected: boolean,
    text: string,
    onClick: (e: any) => void
  ): React.ReactNode => {
    return (
      <div
        className={classNames("res", "hoverable", {
          "filled-selected": selected,
          "filled-unselected": !selected,
        })}
        style={{
          width: 50,
          height: 40,
          borderRadius: 5,
          textAlign: "center",
          lineHeight: 2 
        }}
        onClick={onClick}
      >
        {text}
      </div>
    );
  };

  return (
    <div className="res-container">
      {renderFilled(respondents.length === selectedRespondents.length, "ALL", (e: any) => selectAll())}
      {respondents.filter((r) => r.name !== member).map(mapRespondent)}
    </div>
  );
};

export { EventRespondents };
