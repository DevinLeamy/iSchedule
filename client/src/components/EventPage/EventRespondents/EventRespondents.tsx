import React, { useState, useContext } from "react";
import classNames from "classnames";
import { Chip, Avatar } from "@mui/material";

import { EventContext } from "../../contexts";
import { generateRandomColor } from "../../../utilities";

import "./EventRespondents.css";

const EventRespondents: React.FC = ({}) => {
  const { respondents, member, selectedRespondents, setSelectedRespondents } =
    useContext(EventContext);

  const toggleRespondent = (respondent: string): void => {
    let remove = selectedRespondents.includes(respondent);
    let updated = selectedRespondents.filter((m) => m !== respondent);

    if (!remove) {
      updated.push(respondent);
    }

    setSelectedRespondents(updated);
  };

  const selectAll = (): void => {
    setSelectedRespondents(respondents);
  };

  const mapRespondent = (respondent: string): React.ReactNode => {
    const selected = selectedRespondents.includes(respondent);

    return (
      <div
        className={classNames(
          "res",
          "hoverable"
          // {
          //   'filled-selected': selected,
          // 'filled-unselected': !selected
          // }
        )}
        onClick={(e) => toggleRespondent(respondent)}
      >
        <Chip
          sx={{ height: 40 }}
          avatar={
            <Avatar
              sx={{
                bgcolor: generateRandomColor(),
                height: "32px !important",
                width: "32px !important",
                fontSize: "17px !important",
                color: "black !important",
              }}
            >
              {respondent.slice(0, 2)}
            </Avatar>
          }
          label={respondent}
          variant="outlined"
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
        onClick={onClick}
      >
        {text}
      </div>
    );
  };

  return (
    <div className="res-container">
      {renderFilled(false, "ALL", (e: any) => selectAll())}
      {/* {member !== undefined && (
        renderFilled(
          (member !== undefined && selectedRespondents.includes(member)),
          member,
          (e: any) => {
            if (member !== undefined) {
              toggleRespondent(member)
            }
          }
        )
      )} */}
      {respondents.filter((r) => r !== member).map(mapRespondent)}
    </div>
  );
};

export { EventRespondents };
