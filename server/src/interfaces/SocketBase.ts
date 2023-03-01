import { Namespace, Socket } from "socket.io";
import Websocket from "../websocket/Websocket.js";
import SocketData from "./SocketDataTypes.js";
import ISocketBase from "./ISocketBase.js";

/**
 * The default class used to create other `SocketBase` classes for different routes and topics.
 *
 * @param path - The URL path to access this socket. Example: '/news'.
 * @param io - The base `Websocket` instance used to register all sockets.
 *
 * @property users - A list of clients connected to the socket.
 * @property socket - The own users socket.
 */
export default abstract class SocketBase implements ISocketBase {
  protected path: string;
  protected users: SocketData[];
  protected socket: Socket;
  protected mainSocket: Websocket;

  constructor(path: string, io: Websocket) {
    this.mainSocket = io;
    this.path = path;
    this.users = [];
  }

  /**
   * Add a user to the clients list.
   *
   * @param user - The user's data.
   */
  addUser(user: SocketData) {
    this.users.push(user);
  }

  /**
   * @returns The socket's path url.
   */
  getPath() {
    return this.path;
  }

  /**
   * Update's the user list and removes any disconnected users.
   */
  updateUsers() {
    for (let i = 0; i < this.users.length; i++)
      if (!this.users[i].socket.connected) delete this.users[i];

    this.users = this.users.filter((n) => n); // Needed to clear out undefined/nulls
  }

  /**
   * Basic handler to stablish the user and server's connection.
   *
   * @param clientSocket - The user's `Socket` instance.
   */
  handleConnection(clientSocket: Socket): void {
    this.socket = clientSocket;

    this.registerUser();

    this.registerHandlers();
  }

  /**
   * Handler register function.
   */
  registerHandlers(): void {
    this.handlePing();
    this.handleDisconnect();
  }

  /**
   * Basic handler to disconnect the user from the server.
   */
  handleDisconnect(): void {
    throw new Error(" Disconnect method not implemented.");
  }

  /**
   * Registers a user to the socket.
   */
  registerUser(): void {
    throw new Error("Register method not implementmatted.");
  }

  /**
   * Basic handler to respond to socket pings.
   */
  handlePing(): void {
    this.socket.on("ping", () => {
      this.socket.emit("pong");
    });
  }

  /**
   * Used as a shorthand to broadcast to all clients (since `socket.broadcast` doesn't work as effectively).
   *
   * @returns The namespace to emit to all members in it's path.
   */
  broadcast(): Namespace {
    return this.mainSocket.of(this.path);
  }
}
