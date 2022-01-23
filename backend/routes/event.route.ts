import express, { Router } from "express";
import { EVENT_CTRL } from "../controllers/event.controller";
export const EVENT_API: Router = express.Router();

EVENT_API.get("/create", EVENT_CTRL.createEvent);
