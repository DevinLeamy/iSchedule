import React from 'react';
import './Header.css'

const Header: React.FC<{content: string}> = ({content}) => {
  return (
    <div className="header-main">
      {content}
    </div>
  );
}

export default Header;
