// import { Types } from "mongoose";
import { Response } from "express";

// String.prototype.toObjectId = function() {
//   return new Types.ObjectId(this.toString());
// };

const respond = (res: Response, data: any, options: { status?: number, message?: string } = {}) : void => 
{
  let status = options.status ?? 0;
  let message = options.message ?? '';
  res.json({status, data, message});
}

export { respond };
