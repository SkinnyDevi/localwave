import { Socket } from "socket.io-client";
import { FileDropFile, UserData } from "./interfaces/SocketDataTypes";

export default class CommonUtils {
  static emitFileDrop(socket: Socket, receiver: UserData, files: FileList) {
    const filedropFiles: FileDropFile[] = [];

    for (let f of Array.from(files)) {
      filedropFiles.push({
        file: f,
        metadata: {
          lastModified: f.lastModified,
          size: f.size,
          name: f.name,
          type: f.type,
        },
      });
    }

    socket.emit("filedrop-send", {
      from: socket.id,
      to: receiver.socket_id,
      files: filedropFiles,
    });
  }

  static parseFileDrop(filedrop: FileDropFile[]): File[] {
    const files: File[] = [];

    for (let f of filedrop) {
      files.push(
        new File([f.file], f.metadata.name, {
          type: f.metadata.type,
          lastModified: f.metadata.lastModified,
        })
      );
    }

    return files;
  }
}
