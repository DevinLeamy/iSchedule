import React, { CSSProperties as CSS, useState, useEffect, useRef, MutableRefObject as MRef } from "react";
import classNames from "classnames";

import { Position } from "../../../types";

import "./GridCell.css";

export interface GridCellProps {
  location: Position, 
  selected?: boolean,
  hoverStyle?: CSS,
  style?: CSS,
  onMouseDown?: (position: Position) => void
}

const GridCell: React.FC<GridCellProps> = ({
  location, 
  selected = false,
  hoverStyle = {},
  style = {},
  onMouseDown = () => {}
}) => {

  const [hovering, setHovering] = useState<boolean>(false);
  const cellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (cellRef?.current) {
      cellRef.current.addEventListener("mouseenter", () => setHovering(true))
      cellRef.current.addEventListener("mouseleave", () => setHovering(false))
    }
  }, [])
  const onHourBound = location.row % 4 == 0;

  return (
    <div 
      ref={cellRef}
      className={classNames(
        "grid-cell",
        { "grid-cell-hour" : onHourBound },
        { "grid-cell-selected" : selected } 
      )}
      style={hovering ? {...style, ...hoverStyle}: style}
      onMouseDown={() => onMouseDown(location)}
    />
  );
}

export { GridCell }
