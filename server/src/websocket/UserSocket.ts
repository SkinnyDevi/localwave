import { Socket } from "socket.io";
import {
  uniqueNamesGenerator,
  Config,
  languages,
  names,
} from "unique-names-generator";
import { v4 as uuid } from "uuid";

import StandardSocket from "../interfaces/StandardSocket.js";
import UserData from "../interfaces/UserData.js";

class UserSocket implements StandardSocket {
  private socket: Socket;
  private users: UserData[] = [];
  private nameGeneratorConfig: Config = {
    dictionaries: [languages, names],
    separator: "_",
  };

  handleConnection(userSocket: Socket, clientList: UserData[]) {
    this.socket = userSocket;
    this.users = clientList;

    this.registerUser();

    this.registerHandlers();
  }

  registerHandlers() {
    this.handlePing();
    this.handleUserList();
    this.handleDisconnect();
  }

  handleDisconnect() {
    this.socket.on("disconnect", () => {
      this.users.forEach((user: UserData) => {
        if (user.socket.id === this.socket.id) {
          return this.users.splice(this.users.indexOf(user), 1);
        }
      });
      console.log("[Disconnection] Connected users: ", this.users.length);
    });
  }

  handleUserList() {
    this.socket.on("list", () => {
      this.users.forEach((u: UserData) =>
        console.log({ UUID: u.UUID, name: u.name })
      );
    });
  }

  handleRemoveUser() {
    this.socket.on("remove-user", (profile: UserData) => {
      console.log("Removing user: ", profile.UUID);
      this.users.splice(this.users.indexOf(profile));

      this.socket.emit("user-removed");
    });
  }

  registerUser() {
    let newUser = this.generateProfile();
    this.users.push(newUser);

    this.socket.emit("regcomplete", { UUID: newUser.UUID, name: newUser.name });

    console.log("[Connection] Connected users: ", this.users.length);
  }

  handlePing() {
    this.socket.on("ping", () => {
      this.socket.emit("pong");
    });
  }

  private generateProfile(): UserData {
    return {
      UUID: uuid(),
      name: uniqueNamesGenerator(this.nameGeneratorConfig),
      socket: this.socket,
    };
  }
}

export default UserSocket;
