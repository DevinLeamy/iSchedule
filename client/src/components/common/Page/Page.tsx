import React from 'react';
import './Page.css'
import ContentPane from "../../../components/common/ContentPane/ContentPane";


const Page: React.FC = ({children}) => {
  return (
    <div className="full-page">
      <ContentPane>
        {children}
      </ContentPane>
    </div>
  );
}

export default Page
