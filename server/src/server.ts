import express, { Response } from "express";
import * as dotenv from "dotenv";
import { createServer } from "http";

import Websocket from "./websocket/Websocket.js";
import UserSocket from "./websocket/UserSocket.js";

dotenv.config();

const app = express();
const USE_IP = false;
const IP = "10.193.111.55";

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
