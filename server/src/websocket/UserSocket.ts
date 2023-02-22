import { Socket } from "socket.io";
import StandardSocket from "../interfaces/StandardSocket.js";

class UserSocket implements StandardSocket {
  private socket: Socket;

  registerHandlers(socket: Socket) {
    this.socket = socket;

    this.handleConnection();
    this.handlePing();
  }

  handleConnection() {
    this.socket.on("connection", () => {
      this.socket.emit("successfulconn");
    });
  }

  handlePing() {
    this.socket.on("ping", () => {
      this.socket.emit("pong");
    });
  }
}

export default UserSocket;
