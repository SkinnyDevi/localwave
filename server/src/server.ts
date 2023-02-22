import express, { Response } from "express";
import * as dotenv from "dotenv";
import { createServer } from "http";

import Websocket from "./websocket/Websocket.js";
import UserSocket from "./websocket/UserSocket.js";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 8989;

app.get("/", (_, res: Response) => {
  res.send("Express is online.");
});

const httpServer = createServer(app);
const io = Websocket.getInstance(httpServer);

io.initializeHandlers([{ path: "/users", handler: new UserSocket() }]);

httpServer.listen(PORT, () => {
  console.log(`[server]: Server is running on http://localhost:${PORT}`);
});
