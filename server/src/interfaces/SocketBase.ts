import { Socket } from "socket.io";
import Websocket from "../websocket/Websocket.js";

export interface SocketBaseInterface {
  getPath(): string;

  handleConnection(clientSocket: Socket, clientList: any[]): void;
  registerHandlers(): void;
  handleDisconnect(): void;
  registerUser(): void;
  handlePing(): void;
}

abstract class SocketBase implements SocketBaseInterface {
  protected path: string;
  protected users: Array<any>;
  protected socket: Socket;
  protected mainSocket: Websocket;

  constructor(path: string, io: Websocket) {
    this.mainSocket = io;
    this.path = path;
  }

  getPath(): string {
    return this.path;
  }

  handleConnection(clientSocket: Socket, clientList?: any[]): void {
    this.socket = clientSocket;
    if (clientList) this.users = clientList;

    this.registerUser();

    this.registerHandlers();
  }

  registerHandlers(): void {
    this.handlePing();
    this.handleDisconnect();
  }

  handleDisconnect(): void {
    throw new Error(" Disconnect method not implemented.");
  }

  registerUser(): void {
    throw new Error("Register method not implemented.");
  }

  handlePing(): void {
    this.socket.on("ping", () => {
      this.socket.emit("pong");
    });
  }
}

export default SocketBase;
