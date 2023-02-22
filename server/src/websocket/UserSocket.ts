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
  private users: UserData[] = [];
  private nameGeneratorConfig: Config = {
    dictionaries: [languages, names],
    separator: "_",
  };

  registerHandlers(socket: Socket) {
    this.socket = socket;

    this.handlePing();
    this.handleRegister();
    this.handleRemoveUser();
    this.handleUserList();
  }

  handleConnection() {
    throw new Error("Method not implemented.");
  }

  handleUserList() {
    this.socket.on("list", () => {
      this.users.forEach((u) => console.log(u));
    });
  }

  handleRemoveUser() {
    this.socket.on("remove-user", (profile: UserData) => {
      this.users.splice(this.users.indexOf(profile));
    });
  }

  handleRegister() {
    this.socket.on("register", (userData: UserData) => {
      userData.name = this.generateName();

      this.users.push(userData);
      this.socket.emit("register-complete", userData);
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
