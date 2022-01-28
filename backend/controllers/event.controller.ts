import { Request, Response, NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { EventModel, EventSchema, Event } from "../models";
import { respond } from "../utils";

const EVENT_CTRL = {
  createEvent: async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body; 

    let newEvent: HydratedDocument<Event> = new EventModel({
      name: payload.name,
      dateRanges: payload.dateRanges,
      members: [],
      timezone: payload.timezone
    });
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
  },

  getEventMember: async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    let eventId: string = req.params._id;
    let memberName: string = req.params.name;

    try {
      // TODO: this is pretty hacky - refactor to only return one member 

      // data: { _id: string, members: [members that have name=memberName]}
      let data = await EventSchema.methods.getEventMember(eventId, memberName).exec();
      if (data.members.length === 0) {
        // create new member
        await EventSchema.methods.createEventMember(eventId, memberName).exec();
        data = await EventSchema.methods.getEventMember(eventId, memberName).exec()
      }
      respond(res, data.members[0]);
    } catch (err) {
      console.log(err);
      respond(res, null, {status: 1, message: "error getting event member"});
    }
  },

  
}

export { EVENT_CTRL }
