import express, { Router } from "express";
import { EVENT_CTRL } from "../controllers/event.controller";
export const EVENT_API: Router = express.Router();

EVENT_API.post("/create", EVENT_CTRL.createEvent);

EVENT_API.get("/:_id", EVENT_CTRL.getEventById);

EVENT_API.get("/:_id/members/:name", EVENT_CTRL.getEventMember);
