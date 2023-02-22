import { Socket } from "socket.io";
import {
  uniqueNamesGenerator,
  Config,
  languages,
  names,
} from "unique-names-generator";

import StandardSocket from "../interfaces/StandardSocket.js";
import UserData from "../interfaces/UserData.js";

class UserSocket implements StandardSocket {
  private socket: Socket;
  private users: UserData;
  private nameGeneratorConfig: Config = {
    dictionaries: [languages, names],
    separator: "_",
  };

  registerHandlers(socket: Socket) {
    this.socket = socket;

    this.handleConnection();
    this.handlePing();
    this.handleRegister();
  }

  handleConnection() {
    this.socket.on("connect", () => {
      console.log("USER CONNECTED");
    });
  }

  handleRegister() {
    this.socket.on("register", (userData: UserData) => {
      console.log("New user: " + userData.UUID);
    });
  }

  handlePing() {
    this.socket.on("ping", () => {
      this.socket.emit("pong");
    });
  }

  private generateName(): string {
    return uniqueNamesGenerator(this.nameGeneratorConfig);
  }
}

export default UserSocket;
