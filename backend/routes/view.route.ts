import express, { Router } from "express";
import { VIEW_CTRL } from "../controllers/view.controller";
export const VIEW_API: Router = express.Router();

VIEW_API.get("/", VIEW_CTRL.sendView);