import { Socket } from "socket.io";

export default interface StandardSocket {
  registerHandlers(socket: Socket): void;

  handleConnection(): void;
}
