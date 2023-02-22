import express, { Response } from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 8989;

app.get("/", (_, res: Response) => {
  res.send("Express is online.");
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running on port ${PORT}`);
});
