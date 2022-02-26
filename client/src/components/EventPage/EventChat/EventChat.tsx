import React, { useContext, useState, useRef } from "react";
import classNames from "classnames";
import { Card, IconButton, Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { EventContext } from "../../contexts";
import { Message, Respondent } from "../../../types";
import { generateRandomColor } from "../../../utilities";

import "./EventChat.css";

const EventChat: React.FC = () => {
  const { event, respondents, member, onNewMessage } = useContext(EventContext);

  const [message, setMessage] = useState<string>("");

  if (event === undefined) return null;

  const onSendMessage = () => {
    if (message === "" || member === undefined) return;

    onNewMessage({
      message: message,
      sender: member,
      datetime: new Date(),
    });

    setMessage("")
  };

  // TODO: move to util


  const renderMessages = (messages: Message[]): React.ReactNode[] => {
    if (messages.length === 0) return []

    let formattedMessages = []
    let prevSendDate = new Date(40) //new Date()
    let prevSender = "" 

    for (let message of messages) {
      if (message.datetime.toDateString() != prevSendDate.toDateString()) {
        formattedMessages.push(
          <div className="ec-message-container message-timestamp">
            - {message.datetime.toDateString()} -
          </div>
        )
      }

      if (message.sender !== prevSender && message.sender !== member) {
        const respondent = respondents.find((r) => r.name === message.sender) as Respondent

        formattedMessages.push(
          // <div className="message-sender">
          //   {message.sender}
          // </div>
          <Avatar 
            sx={{ 
              color: "white",
              width: 35, 
              height: 35, 
              marginTop: 2,
              marginBottom: 1,
              bgcolor: respondent.color,
              marginLeft: 1,
              fontSize: 17
            }}>
            {message.sender.slice(0, 2)}
          </Avatar>
        )
      }

      formattedMessages.push(mapMessage(message))

      prevSendDate = message.datetime
      prevSender = message.sender
    }

    formattedMessages.push(
      <div className="ec-message-container message-timestamp">
        event created
      </div>
    )

    return formattedMessages 
  }

  const mapMessage = (message: Message): React.ReactNode => {
    const memberIsSender = message.sender === member;

    return (
      <div
        className={classNames("ec-message-container", {
          "sender-container": memberIsSender,
          "receiver-container": !memberIsSender,
        })}
      >
        <div
          className={classNames("inner-message-container", {
            sender: memberIsSender,
            receiver: !memberIsSender,
          })}
        >
          <div className="event-message-text">{message.message}</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="ec-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage();
        }}
      >
        <div className="ec-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            onSubmit={() => onSendMessage()}
            placeholder="message"
            style={{
              width: "100%",
              fontSize: "16px",
              padding: "5px",
            }}
          />
          <IconButton onClick={onSendMessage}>
            <SendIcon />
          </IconButton>
        </div>
      </form>
      {renderMessages([...event.messages].reverse())}
    </Card>
  );
};

export { EventChat };
