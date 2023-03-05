import express, { Response } from "express";
import * as dotenv from "dotenv";
import { createServer } from "http";
import path from "path";

import Websocket from "./websocket/Websocket.js";
import UserSocket from "./websocket/UserSocket.js";
import CommonUtils, { CustomProcess } from "./utils.js";

// Setup for production.
dotenv.config();
const customProcess: CustomProcess = process;
if (customProcess.pkg) process.env.NODE_ENV = "production";
const IS_PROD = CommonUtils.testForProduction();
const dirname = IS_PROD ? path.dirname(require.main.filename) : "";

const app = express();
const USE_IP = true; // Change between your local IP and localhost.

// Output 'nets' to console first to see your available interfaces.
// From there, choose your most suitable interfaces.
// Ethernet - standard cabled internet connection interface.
// en0 - Unix based system's Wifi interface.
const nets = CommonUtils.networks();
const IP =
  nets["Ethernet"] ||
  nets["Wi-Fi"] ||
  nets["en0"] ||
  nets["en1"] ||
  nets["en2"];
const PORT = process.env.SERVER_PORT || 3500;
const DOMAIN = `${USE_IP ? IP : "localhost"}:${PORT}`;

if (IS_PROD) {
  app.get("/", (_, res: Response) => {
    res.redirect(`/${DOMAIN}`);
  });

  app.get(`/${DOMAIN}`, (_, res: Response) =>
    res.sendFile(path.join(dirname, "client", "index.html"))
  );

  app.use(express.static(path.join(dirname, "client")));
} else {
  app.get("/", (_, res: Response) => res.send("Express is online."));
}

const httpServer = createServer(app);
const io = Websocket.getInstance(httpServer);

io.initializeHandlers([new UserSocket("/users", io)]);

httpServer.listen(PORT, () => {
  console.log(`[server]: Server is running on http://${DOMAIN}`);
});
