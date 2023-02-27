import {
  uniqueNamesGenerator,
  Config,
  languages,
  names,
} from "unique-names-generator";

import { MessageData, UserData } from "../interfaces/SocketDataTypes.js";
import SocketBase from "../interfaces/SocketBase.js";

class UserSocket extends SocketBase {
  private readonly nameGeneratorConfig: Config = {
    dictionaries: [languages, names],
    separator: "_",
  };

  registerHandlers() {
    super.registerHandlers();
    this.handleUserList();
    this.handlePlainText();
    this.handleFileDrop();
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

  handlePlainText() {
    this.socket.on("sendPlainText", (msg: MessageData) => {
      this.mainSocket
        .of(this.path)
        .sockets.get(msg.to)
        .emit("receivePlainText", msg);
    });
  }

  handleFileDrop() {
    this.socket.on("filedrop-send", (file: File, cb: Function) => {
      console.log(file);
      cb();
    });
  }

  registerUser() {
    let newUser = this.generateProfile();
    this.addUser(newUser);

    this.socket.emit("regcomplete", {
      socket_id: newUser.socket_id,
      name: newUser.name,
      gradient: newUser.gradient,
    });

    this.generatePayloadUserList(true);

    console.log("[+] Connected users: ", this.users.length);
  }

  handlePing() {
    this.socket.on("ping", () => {
      this.socket.emit("pong");
    });
  }

  private hexToRGB(hex: string): string {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    return `rgb(${r}, ${g}, ${b})`;
  }

  private randomGradient(): string {
    let randomHex2: string =
      "#" + Math.floor(Math.random() * 16777215).toString(16);
    let randomHex1: string =
      "#" + Math.floor(Math.random() * 16777215).toString(16);

    return `linear-gradient(45deg, ${this.hexToRGB(
      randomHex1
    )} 0%, ${this.hexToRGB(randomHex2)} 100%)`;
  }

  private generateProfile(): UserData {
    return {
      socket_id: this.socket.id,
      name: uniqueNamesGenerator(this.nameGeneratorConfig),
      socket: this.socket,
      gradient: this.randomGradient(),
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
        userList.push({
          socket_id: u.socket_id,
          name: u.name,
          gradient: u.gradient,
        });
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
