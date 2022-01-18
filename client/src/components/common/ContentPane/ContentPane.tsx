import React from 'react'
import Navbar from '../../../components/Navbar/Navbar';
import './ContentPane.css'

const ContentPane: React.FC = ({children}) => {

  return (
    <div className="content-pane">
      <Navbar />
      {children}
    </div>
 );
}

export default ContentPane;
