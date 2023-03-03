import express, { Response } from "express";
import * as dotenv from "dotenv";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

import Websocket from "./websocket/Websocket.js";
import UserSocket from "./websocket/UserSocket.js";
import CommonUtils from "./utils.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const USE_IP = true; // Change between your local IP and localhost.

// Output 'nets' to console first to see your available interfaces.
// From there, choose your most suitable interfaces.
// Ethernet - standard cabled internet connection interface.
// en0 - Unix based system's Wifi interface.
const nets = CommonUtils.networks();
const IP = nets["Ethernet"] || nets["en0"];
const PORT = process.env.SERVER_PORT || 3500;
const HOST = USE_IP ? IP : "localhost";

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client")));
  app.get("/*", (_, res: Response) =>
    res.sendFile(path.join(__dirname, "client", "index.html"))
  );
} else {
  app.get("/", (_, res: Response) => res.send("Express is online."));
}

const httpServer = createServer(app);
const io = Websocket.getInstance(httpServer);

io.initializeHandlers([new UserSocket("/users", io)]);

httpServer.listen(PORT, () => {
  console.log(`[server]: Server is running on http://${HOST}:${PORT}`);
});
