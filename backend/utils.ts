// import { Types } from "mongoose";
import { Response } from "express";

const respond = (res: Response, data: any, options: { status?: number, message?: string } = {}) : void => 
{
  let status = options.status ?? 0;
  let message = options.message ?? '';
  res.json({status, data, message});
}

export { respond };
