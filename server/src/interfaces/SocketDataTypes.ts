import { Socket } from "socket.io";

export type UserData = {
  socket_id: string;
  name?: string;
  socket: Socket;
  gradient: string;
};

export type MessageData = {
  from: string; // Sender Socket ID
  message: string;
  to: string; // Sender Socket ID
};

type FileDropMetadata = {
  size: number;
  type: string;
  name: string;
};

type FileDropFile = {
  file: ArrayBuffer;
  metadata: FileDropMetadata;
};

export type FileDropData = {
  from: string; // Sender Socket ID
  files: FileDropFile[];
  to: string; // Sender Socket ID
};

type SocketData = UserData;

export default SocketData;
