import { useEffect, useState, useRef, MutableRefObject as MRef } from "react";

export type Position = {
  row: number,
  col: number
}

export const useMouseCapture = (divRef: MRef<HTMLDivElement | null>, rows: number, cols: number) : Position | undefined => {
  const mousePosition = useRef<Position>({row: 0, col: 0}) 

  const handleMouseMove = (event: any) => {
    if (!divRef?.current) return;

    const bounds = divRef.current.getBoundingClientRect();

    let x = event.clientX - bounds.left;
    let y = event.clientY - bounds.top;

    let row = Math.floor((y / bounds.height) * rows);
    let col = Math.floor((x / bounds.width) * cols);

    mousePosition.current.row = row;
    mousePosition.current.col = col;
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


  return mousePosition.current;
}
