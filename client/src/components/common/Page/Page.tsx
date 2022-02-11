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
      </ContentPane>
    </div>
  );
}

export { Page };
