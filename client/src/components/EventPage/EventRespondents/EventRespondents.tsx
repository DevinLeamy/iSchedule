import React, { useState, useContext } from "react"
import classNames from "classnames"

import { EventContext } from "../../contexts" 

import "./EventRespondents.css"

const EventRespondents: React.FC = ({
}) => {
  const { respondents, member, selectedRespondents, setSelectedRespondents }  = useContext(EventContext)

  const toggleRespondent = (respondent: string) : void => {
    let remove = selectedRespondents.includes(respondent)
    let updated = selectedRespondents.filter(m => m !== respondent)

    if (!remove) {
      updated.push(respondent)
    }

    setSelectedRespondents(updated)
  }

  const selectAll = () : void => {
    setSelectedRespondents(respondents)
  }

  const mapRespondent = (respondent: string) : React.ReactNode => {
    const selected = selectedRespondents.includes(respondent)

    return (
      <div 
        className={classNames(
          'res',
          'hoverable',
          {
            'outline-selected': selected,
            'outline-unselected': !selected
          }
        )}
        onClick={(e) => toggleRespondent(respondent)}
      >
        {respondent}
      </div>
    )
  }

  const renderFilled = (selected: boolean, text: string, onClick: (e: any) => void) : React.ReactNode => {
    return (
      <div 
        className={classNames(
          'res',
          'hoverable',
          {
            'filled-selected': selected,
            'filled-unselected': !selected
          }
        )}
        onClick={onClick}
      >{text}</div>
    )
  }

  return (
    <div className="res-container"> 
      {renderFilled(
        false,
        "SELECT ALL",
        (e: any) => selectAll()
      )}
      {member !== undefined && (
        renderFilled(
          (member !== undefined && selectedRespondents.includes(member)),
          member,
          (e: any) => {
            if (member !== undefined) {
              toggleRespondent(member)
            }
          }
        )
      )}
     {respondents.filter(r => r !== member).map(mapRespondent)}
    </div>
  )
}

export { EventRespondents }
