import express, { Response } from "express";
import * as dotenv from "dotenv";
import { createServer } from "http";

import Websocket from "./websocket/Websocket.js";
import UserSocket from "./websocket/UserSocket.js";
import CommonUtils from "./utils.js";

dotenv.config();

const app = express();
const USE_IP = true; // Change between your local IP and localhost.

// Output 'nets' to console first to see your available interfaces.
// From there, choose your most suitable interfaces.
// Ethernet - standard cabled internet connection interface.
// en0 - Unix based system's Wifi interface.
const nets = CommonUtils.networks();
const IP = nets["Ethernet"] || nets["en0"];

const PORT = process.env.SERVER_PORT || 8989;
const HOST = USE_IP ? IP : "localhost";

app.get("/", (_, res: Response) => {
  res.send("Express is online.");
});

const httpServer = createServer(app);
const io = Websocket.getInstance(httpServer);

io.initializeHandlers([new UserSocket("/users", io)]);

httpServer.listen(PORT, () => {
  console.log(`[server]: Server is running on http://${HOST}:${PORT}`);
});
