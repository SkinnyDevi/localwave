import { Socket } from "socket.io";

export default interface UserData {
  UUID: string;
  name?: string;
  socket: Socket;
}
