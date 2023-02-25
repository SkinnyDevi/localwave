import { Socket } from "socket.io";

type UserData = {
  socket_id: string;
  name?: string;
  socket: Socket;
};

export default UserData;
