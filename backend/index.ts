import express from "express";
import bodyParser from "body-parser";
import SERVER_CONFIG from "./config/index.config";
import path from "path";

// Import APIs
import { USER_API } from "./routes/user.route";
import { VIEW_API } from "./routes/view.route";

// Express config
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set API routes
app.use("", VIEW_API);
app.use("/user", USER_API);

app.use(express.static(path.join(__dirname, "../client/build")));

const PORT: number = SERVER_CONFIG.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
