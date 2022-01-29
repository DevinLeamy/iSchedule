import React, { CSSProperties as CSS } from "react";

import { List } from "../";

interface GridCellsListProps {
  minRow: number,
  maxRow: number,
  mapRowToCell: (row: number) => React.ReactNode,
  containerStyle?: CSS
}

const GridCellsList: React.FC<GridCellsListProps> = ({
  minRow,
  maxRow,
  mapRowToCell,
  containerStyle = {}
}) => {
  const rows = Array.from(Array(maxRow - minRow + 1).keys()).map(row => row + minRow);
  return (
    <div className="grid-cells-list" style={containerStyle}>
      <List
        items={rows}
        listItemMap={mapRowToCell}
      />
    </div>
  );
}

export { GridCellsList }
