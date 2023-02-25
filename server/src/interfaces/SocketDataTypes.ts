import { Socket } from "socket.io";

export type UserData = {
  socket_id: string;
  name?: string;
  socket: Socket;
};

type SocketData = UserData;

export default SocketData;
