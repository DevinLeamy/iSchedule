import React from 'react';
import "./ContentBox.css"

const ContentBox: React.FC = ({children}) => {
  return (
    <div className="cbox-main">
      {children}
    </div>
  );
}

export default ContentBox;
