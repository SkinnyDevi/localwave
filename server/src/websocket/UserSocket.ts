import {
  uniqueNamesGenerator,
  Config,
  languages,
  names,
} from "unique-names-generator";

import { UserData } from "../interfaces/SocketDataTypes.js";
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
      this.updateUsers();
      this.generatePayloadUserList(true);
      console.log("[-] Connected users: ", this.users.length);
    });
  }

  handleUserList() {
    this.socket.on("list", () => {
      this.users.forEach((u: UserData) => console.log(u.socket_id, u.name));
    });
  }

  registerUser() {
    let newUser = this.generateProfile();
    this.addUser(newUser);

    this.socket.emit("regcomplete", {
      socket_id: newUser.socket_id,
      name: newUser.name,
    });

    this.generatePayloadUserList(true);

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
    emitList?: UserData[]
  ): UserData[] {
    let userList = [];
    if (!emitOnly) {
      for (let u of this.users)
        userList.push({ socket_id: u.socket_id, name: u.name });
    }

    if (!gatherAndEmit && !emitOnly) return userList;

    if (gatherAndEmit) {
      for (let _ of this.users) this.broadcast().emit("user-list", userList);
    }

    if (emitOnly) {
      if (emitList)
        for (let _ of this.users) this.broadcast().emit("user-list", emitList);
      else throw new Error("No list was passed to emit directly");
    }
  }
}

export default UserSocket;
