import { useEffect, useState, MutableRefObject as MRef } from "react";

export type Position = {
  row: number,
  col: number
}

export const useMouseCapture = (divRef: MRef<HTMLDivElement | null>, rows: number, cols: number) : Position | undefined => {
  const [mousePosition, setMousePosition] = useState<Position>();

  const handleMouseMove = (event: any) => {
    if (!divRef?.current) return;

    const bounds = divRef.current.getBoundingClientRect();

    let x = event.clientX - bounds.left;
    let y = event.clientY - bounds.top;

    let row = Math.floor((y / bounds.height) * rows);
    let col = Math.floor((x / bounds.width) * cols);

    let position: Position = { row, col };

    setMousePosition(position);
  }

  useEffect(() => {
    if (divRef?.current) {
      divRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (divRef?.current) {
        divRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    }
  }, []);


  return mousePosition;
}
