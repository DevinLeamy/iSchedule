import React, { ReactNode } from "react";

interface ListProps {
  listItemMap: (item: any) => ReactNode,
  listKeyMap?: (item: any) => any,
  items: any[],
  horizontal?: boolean
}

const List: React.FC<ListProps> = ({
  listItemMap,
  listKeyMap = (item: any) : any => item,
  items,
  horizontal = false
}) => {
  return (
    <div style={ horizontal ? { display: "flex", width: "100%"} : {}}>
      {[...items].map(item => 
        <React.Fragment key={listKeyMap(item)}>
          {listItemMap(item)}
        </React.Fragment>
      )}
   </div>  
  );
}

export { List };

