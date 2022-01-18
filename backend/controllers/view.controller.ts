import { Request, Response, NextFunction } from "express";
import path from "path";

export const VIEW_CTRL = {
  sendView: (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(path.resolve("../client/build/index.html"));
    // res.sendFile(path.resolve("./c/index.html"));
  }
};
