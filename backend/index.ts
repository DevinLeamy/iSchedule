import dotenv from 'dotenv'
import express from "express";
import { connect, connection } from "mongoose";
import bodyParser from "body-parser";
import SERVER_CONFIG from "./config/index.config";
import path from "path";

dotenv.config();

connect(process.env.DB_URL ?? 'ERROR');

/*
0: disconnected
1: connected
2: connecting
3: disconnecting
*/

console.log(connection.readyState)

// Import APIs
import { VIEW_API } from "./routes/view.route";
import { EVENT_API } from "./routes/event.route";

// Express config
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set API routes
app.use("", VIEW_API);
app.use("/events", EVENT_API);

app.use(express.static(path.join(__dirname, "../client/build")));

const PORT: number = SERVER_CONFIG.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
