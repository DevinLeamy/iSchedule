import { Request, Response, NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { EventModel, Event } from "../models";
import { respond } from "../utils";

const EVENT_CTRL = {
  createEvent: async (req: Request, res: Response, next: NextFunction) => {
    const payload: Event = req.body; 

    let newEvent: HydratedDocument<Event> = new EventModel(payload);
    await newEvent.save();

    respond(res, { _id: newEvent._id })
  },

  getEventById: async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    let eventId: string = req.params._id;

    try {
      let event = await EventModel.findById(eventId, { versionKey: false }).exec();
      respond(res, event?.toJSON({ versionKey: false }));
    } catch (err) {
      console.log(err)
      respond(res, null, {status: 1, message: "error getting event by id"})
    }

    EventModel
      .findById(eventId, { versionKey: false }, (err: Error, event: HydratedDocument<Event>) => {
        respond(res, event.toJSON({ versionKey: false }));
      })
  }
}

export { EVENT_CTRL }
