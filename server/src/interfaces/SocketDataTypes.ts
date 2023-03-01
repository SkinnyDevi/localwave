import { Socket } from "socket.io";

/**
 * User profile's data.
 */
export type UserData = {
  socket_id: string;
  name?: string;
  socket: Socket;
  gradient: string;
};

/**
 * The data received from a plain text socket transfer.
 */
export type MessageData = {
  from: string; // Sender Socket ID
  message: string;
  to: string; // Sender Socket ID
};

/**
 * The metadata from a File used to preserve the original file's metadata through the transfer.
 */
type FileDropMetadata = {
  size: number;
  type: string;
  name: string;
};

/**
 * A `FileDrop` file object. Contains the `ArrayBuffer` passed from the socket and it's `FileDropMetadata`.
 */
type FileDropFile = {
  file: ArrayBuffer;
  metadata: FileDropMetadata;
};

/**
 * The `FileDrop` data cotaining the transferred files.
 */
export type FileDropData = {
  from: string; // Sender Socket ID
  files: FileDropFile[];
  to: string; // Sender Socket ID
};

// Used for any future addition to another `SocketBase` class data.
type SocketData = UserData;

export default SocketData;
