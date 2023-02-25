import { Socket } from "socket.io";
import Websocket from "../websocket/Websocket.js";
import UserData from "./UserData.js";

type SocketData = UserData;

export interface ISocketBase {
  get path(): string;
  get users(): SocketData[];

  handleConnection(clientSocket: Socket, clientList: any[]): void;
  registerHandlers(): void;
  handleDisconnect(): void;
  registerUser(): void;
  handlePing(): void;
}

abstract class SocketBase implements ISocketBase {
  private _path: string;
  private _users: SocketData[];
  protected socket: Socket;
  protected mainSocket: Websocket;

  constructor(path: string, io: Websocket) {
    this.mainSocket = io;
    this._path = path;
    this._users = [];
  }

  public get path() {
    return this._path;
  }

  public get users() {
    return this._users;
  }

  addUser(user: SocketData) {
    this._users.push(user);
  }

  removeUser(userId: string) {
    this._users = this._users.filter((u) => u.socket_id !== userId);
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
}

export default SocketBase;
