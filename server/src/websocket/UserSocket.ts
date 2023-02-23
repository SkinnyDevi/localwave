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
    this.handleListReset();
    this.handleDisconnection();
  }

  handleDisconnection() {
    this.socket.on("disconnect", () => {
      console.log("USer disconnected");
    });
  }

  handleUserList() {
    this.socket.on("list", () => {
      this.users.forEach((u) => console.log(u));
    });
  }

  handleListReset() {
    this.socket.on("reset-list", () => {
      this.users = [];
      console.log("Deleted users");
    });
  }

  handleRemoveUser() {
    this.socket.on("remove-user", (profile: UserData) => {
      console.log("Removing user: ", profile.UUID);
      this.users.splice(this.users.indexOf(profile));

      this.socket.emit("user-removed");
    });
  }

  handleRegister() {
    this.socket.on("register", (userData: UserData) => {
      if (userData.UUID === null)
        return this.socket.emit("regfailed", { error: "No UUID specified." });

      console.log("Registering user: ", userData.UUID);
      userData.name = this.generateName();

      this.users.push(userData);
      this.socket.emit("regcomplete", userData);
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
