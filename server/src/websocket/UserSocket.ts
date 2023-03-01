import {
  uniqueNamesGenerator,
  Config,
  languages,
  names,
} from "unique-names-generator";

import {
  FileDropData,
  MessageData,
  UserData,
} from "../interfaces/SocketDataTypes.js";
import SocketBase from "../interfaces/SocketBase.js";

/**
 * Used for user information and data transfers between them.
 * Handles plain text and file transfers.
 *
 * @default path - '/users'
 */
export default class UserSocket extends SocketBase {
  private readonly nameGeneratorConfig: Config = {
    dictionaries: [languages, names],
    separator: "_",
  };

  registerHandlers() {
    super.registerHandlers();
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

  /**
   * Handler used to receive and send plain text messages.
   */
  handlePlainText() {
    this.socket.on("sendPlainText", (msg: MessageData) => {
      this.mainSocket
        .of(this.path)
        .sockets.get(msg.to)
        .emit("receivePlainText", msg);
    });
  }

  /**
   * Handler used to receive and send file objects.
   */
  handleFileDrop() {
    this.socket.on("filedrop-send", (files: FileDropData) => {
      this.mainSocket
        .of(this.path)
        .sockets.get(files.to)
        .emit("filedrop-receive", files);
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

  /**
   * Converts Hex colour strings to 'rgb' CSS strings.
   *
   * @param hex - Hex colour string.
   * @returns CSS 'rgb' string conversion.
   *
   * @private
   */
  private hexToRGB(hex: string): string {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Generates a random CSS linear gradient string.
   *
   * @returns A CSS gradient string.
   *
   * @private
   */
  private randomGradient(): string {
    let randomHex2: string =
      "#" + Math.floor(Math.random() * 16777215).toString(16);
    let randomHex1: string =
      "#" + Math.floor(Math.random() * 16777215).toString(16);

    return `linear-gradient(45deg, ${this.hexToRGB(
      randomHex1
    )} 0%, ${this.hexToRGB(randomHex2)} 100%)`;
  }

  /**
   * Generates a user profile with random names and gradient.
   *
   * @returns a user profile.
   *
   * @private
   */
  private generateProfile(): UserData {
    return {
      socket_id: this.socket.id,
      name: uniqueNamesGenerator(this.nameGeneratorConfig),
      socket: this.socket,
      gradient: this.randomGradient(),
    };
  }

  /**
   * Gathers and/or send (or only send) a transfer readable list of current clients in the socket.
   *
   * @param gatherAndEmit - If emit directly after gathering the user list.
   * @param emitOnly - Only a emit a selected list of clients.
   * @param emitList - Must be passed if `emitOnly` is `true`.
   * @returns a transfer readable list of current clients in the socket.
   *
   * @private
   */
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
