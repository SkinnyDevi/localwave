import { Socket, Namespace } from "socket.io";
import {
  uniqueNamesGenerator,
  Config,
  languages,
  names,
} from "unique-names-generator";

import UserData from "../interfaces/UserData.js";
import SocketBase from "../interfaces/SocketBase.js";

class UserSocket extends SocketBase {
  private readonly nameGeneratorConfig: Config = {
    dictionaries: [languages, names],
    separator: "_",
  };

  registerHandlers() {
    super.registerHandlers();
    this.handleUserList();
  }

  handleDisconnect() {
    this.socket.on("disconnect", () => {
      this.removeUser(this.socket.id);
      this.generatePayloadUserList(
        true,
        false,
        null,
        this.mainSocket.of(this.path)
      );
      console.log("[-] Connected users: ", this.users.length);
    });
  }

  handleUserList() {
    this.socket.on("list", () => {
      this.users.forEach((u: UserData) => console.log(u.socket_id, u.name));
    });
  }

  handleRemoveUser() {
    this.socket.on("remove-user", (profile: UserData) => {
      console.log("Removing user: ", profile.socket_id);
      this.users.splice(this.users.indexOf(profile));

      this.socket.emit("user-removed");
    });
  }

  registerUser() {
    let userList = this.generatePayloadUserList();

    let newUser = this.generateProfile();
    this.users.push(newUser);

    this.socket.emit("regcomplete", {
      socket_id: newUser.socket_id,
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
      socket_id: this.socket.id,
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
      for (let u of this.users)
        userList.push({ socket_id: u.socket_id, name: u.name });
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
