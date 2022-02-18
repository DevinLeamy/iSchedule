import React, { useContext, useState, useRef } from "react"
import classNames from "classnames"
import { TextField, Button } from '@mui/material';

import { EventContext } from "../../contexts"
import { Message } from "../../../types" 

import "./EventChat.css"

const EventChat: React.FC = () => {
  const { event, member, onNewMessage } = useContext(EventContext)

  const [message, setMessage] = useState<string>("")

  if (event === undefined) return null;

  const onSendMessage = () => {
    if (message === "" || member === undefined) return;

    onNewMessage({
      message: message, 
      sender: member,
      datetime: new Date()
    })
  }

  const mapMessage = (message: Message) : React.ReactNode => {
    const memberIsSender = message.sender === member 

    return (
      <div className={classNames(
          "ec-message-container",
          {
            "sender": memberIsSender,
            "receiver": !memberIsSender
          }
        )}
      >
        <div className="message-sender">
          {message.sender}
        </div>
        <div className="message-timestamp">
          {message.datetime.toLocaleTimeString()}
        </div>
        <div className="message-text">
          {message.message}
        </div>
      </div>
    )
  }

  return (
    <div className="ec-container">
      <div className="ec-input">
        <TextField 
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          placeholder="Message" 
          style={{
            height: 50,
            width: "100%"
          }}
          
        />
        <Button
          onClick={onSendMessage}
        >
          Send
        </Button>
      </div>
      {event.messages.map(mapMessage)}
    </div>
  )
}

export { EventChat }
