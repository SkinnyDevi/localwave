import { Socket, Namespace } from "socket.io";
import {
  uniqueNamesGenerator,
  Config,
  languages,
  names,
} from "unique-names-generator";
import { v4 as uuid } from "uuid";

import UserData from "../interfaces/UserData.js";
import SocketBase from "../interfaces/SocketBase.js";

class UserSocket extends SocketBase {
  private nameGeneratorConfig: Config = {
    dictionaries: [languages, names],
    separator: "_",
  };

  registerHandlers() {
    this.handlePing();
    this.handleUserList();
    this.handleDisconnect();
    this.handleDisconnectAll();
  }

  handleDisconnect() {
    this.socket.on("disconnect", () => {
      for (let u of this.users) {
        if (u.socket.id === this.socket.id) {
          this.users.splice(this.users.indexOf(u), 1);
          break;
        }
      }

      this.generatePayloadUserList(
        true,
        false,
        null,
        this.mainSocket.of("/users")
      );
      console.log("[-] Connected users: ", this.users.length);
    });
  }

  handleDisconnectAll() {
    this.socket.on("remove-all", () => {
      this.users.forEach((user: UserData) => {
        user.socket.disconnect();
      });
    });
  }

  handleUserList() {
    this.socket.on("list", () => {
      this.users.forEach((u: UserData) => console.log(u.UUID, u.name));
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
    let userList = this.generatePayloadUserList();

    let newUser = this.generateProfile();
    this.users.push(newUser);

    this.socket.emit("regcomplete", {
      UUID: newUser.UUID,
      name: newUser.name,
    });

    this.generatePayloadUserList(false, true, userList);

    console.log("[+] Connected users: ", this.users.length);
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

  private generatePayloadUserList(
    gatherAndEmit: boolean = false,
    emitOnly: boolean = false,
    emitList?: UserData[],
    customSocket?: Socket | Namespace
  ) {
    let userList = [];
    const socketsender = customSocket ? customSocket : this.socket;
    if (!emitOnly) {
      for (let u of this.users) userList.push({ UUID: u.UUID, name: u.name });
    }

    if (!gatherAndEmit && !emitOnly) return userList;

    if (gatherAndEmit) {
      for (let _ of this.users) socketsender.emit("user-list", userList);
    }

    if (emitOnly) {
      if (emitList)
        for (let _ of this.users) socketsender.emit("user-list", emitList);
      else throw new Error("No list was passed to emit directly");
    }
  }
}

export default UserSocket;
