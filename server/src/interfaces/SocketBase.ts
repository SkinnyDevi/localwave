import { Namespace, Socket } from "socket.io";
import Websocket from "../websocket/Websocket.js";
import UserData from "./UserData.js";

type SocketData = UserData;

export interface ISocketBase {
  handleConnection(clientSocket: Socket, clientList: any[]): void;
  registerHandlers(): void;
  handleDisconnect(): void;
  registerUser(): void;
  handlePing(): void;
  broadcast(): Namespace;
}

abstract class SocketBase implements ISocketBase {
  protected path: string;
  protected users: SocketData[];
  protected socket: Socket;
  protected mainSocket: Websocket;

  constructor(path: string, io: Websocket) {
    this.mainSocket = io;
    this.path = path;
    this.users = [];
  }

  addUser(user: SocketData) {
    this.users.push(user);
  }

  updateUsers() {
    for (let i = 0; i < this.users.length; i++)
      if (!this.users[i].socket.connected) delete this.users[i];

    this.users = this.users.filter((n) => n); // Needed to clear out undefined/nulls
  }

  handleConnection(clientSocket: Socket): void {
    this.socket = clientSocket;

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

  broadcast(): Namespace {
    return this.mainSocket.of(this.path);
  }
}

export default SocketBase;
