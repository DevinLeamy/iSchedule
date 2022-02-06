import React, { ReactNode } from "react";

interface ListProps {
  listItemMap: (item: any, id?: number) => ReactNode,
  listKeyMap?: (item: any, id?: number) => any,
  items: any[],
  horizontal?: boolean
}

const List: React.FC<ListProps> = ({
  listItemMap,
  listKeyMap, 
  items,
  horizontal = false
}) => {
  return (
    <div style={ horizontal ? { display: "flex", width: "100%"} : {}}>
      {[...items].map((item, defaultKey) => 
        <React.Fragment key={listKeyMap ? listKeyMap(item, defaultKey) : defaultKey}>
          {listItemMap(item, defaultKey)}
        </React.Fragment>
      )}
   </div>  
  );
}

export { List };

