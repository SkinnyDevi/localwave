import { Namespace, Socket } from "socket.io";

/**
 * Base functions for any `SocketBase` class.
 */
export default interface ISocketBase {
  handleConnection(clientSocket: Socket, clientList: any[]): void;
  registerHandlers(): void;
  handleDisconnect(): void;
  registerUser(): void;
  handlePing(): void;
  broadcast(): Namespace;
}
