import React, { useState } from "react"
import { useForm, ValidationError } from "@formspree/react"
import { TextField, Button } from "@material-ui/core"

import { Page } from "../common" 

import "./ContactPage.css"

const ContactPage: React.FC = () => {
  const [formState, onSubmit] = useForm("xvolaznr")
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const submitForm = (e: any) => {
    setMessage("")
    setEmail("")
    alert("Thanks for reaching out!")
    onSubmit(e)
  } 

  return (
    <Page>
      <div className="post">
        <form className="form-container" onSubmit={submitForm}>
          <div>Contact us. All questions and concerns are welcome!</div>
          <div className="email-container">
            <input
              placeholder='Email'
              id="email"
              type="email" 
              name="email"
              className="email-input"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <ValidationError 
            prefix="Email" 
            field="email"
            errors={formState.errors}
          />
          <div className="spacer" />
          <textarea
            id="message"
            name="message"
            placeholder="Message"
            className="message-text"
            onChange={e => setMessage(e.target.value)}
            value={message}
          />
          <ValidationError 
            prefix="Message" 
            field="message"
            errors={formState.errors}
          />
          <div className="spacer" />
          <Button 
            type="submit" 
            disabled={formState.submitting}
            variant="contained"
            className="submit-button"
          >
            Submit
          </Button>
        </form>
      </div>
   </Page>
  )
}

export { ContactPage }
