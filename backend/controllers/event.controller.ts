import { Request, Response, NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { EventModel, Event } from "../models";

export const EVENT_CTRL = {
  createEvent: async (req: Request, res: Response, next: NextFunction) => {
    const payload: Event = req.body; 

    // let newEvent: HydratedDocument<Event> = new EventModel(payload);
    const newEvent: HydratedDocument<Event> = new EventModel({
      dateRanges: [],
      timezone: "America/Edmonton",
      userIds: []
    });

    await newEvent.save();

    console.log("New Event Created", newEvent._id)

    res.json({
      status: 1,
      data: undefined,
      message: "A new event was created"
    })
  }
}
