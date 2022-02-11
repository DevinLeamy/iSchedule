import React from 'react'

import Navbar from "../../Navbar/Navbar"

import './ContentPane.css'

interface ContentPaneProps {
  header?: string,
  children: React.ReactNode
}

const ContentPane: React.FC<ContentPaneProps> = ({
  header="",
  children
}) => {
  return (
    <div className="content-pane">
      <Navbar header={header}/>
      {children}
    </div>
 );
}

export { ContentPane };
