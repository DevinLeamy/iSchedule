import React from 'react';


import { ContentPane } from "../../../components/common";

import './Page.css'

interface PageProps {
  header?: string,
  children: React.ReactNode
}

const Page: React.FC<PageProps> = ({
  header="",
  children
}) => {
  return (
    <div className="full-page">
      <ContentPane header={header}>
        {children}
        {/* <div style={{flex: 1}} />
        <div className="footer">
          iSchedule inc. 
        </div> */}
      </ContentPane>
    </div>
  );
}

export { Page };
