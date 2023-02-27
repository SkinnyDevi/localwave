import { Socket } from "socket.io-client";

export default class CommonUtils {
  static emitFileDrop(socket: Socket, files: File) {
    socket.emit("upload", files, this.genericCallback);
  }

  private static genericCallback(status: any) {
    console.log("Server Received: ", status);
  }
}
