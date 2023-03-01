import { Socket } from "socket.io-client";
import { FileDropFile, UserData } from "./interfaces/SocketDataTypes";

/**
 * Class for common utilities.
 */
export default class CommonUtils {
  /**
   * Send a `FileDrop` to a user list through SocketIO, preserving it's metadata.
   *
   * @param socket - The user's `Socket` instance.
   * @param receiver - The `UserData` of the user to receive the files.
   * @param files - The `FileList` object from an HTML input.
   */
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

  /**
   * Parses a received `FileDrop` to a reconstructed file list.
   *
   * @param filedrop - List of `FileDrop` files received.
   * @returns Parsed `File` list.
   */
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

  /**
   * Gets the socket url (IP) from the window's URL.
   * It then checks if the passed path is a valid IP.
   *
   * @returns The socket's url to connect to or non-URL string, resulting in a faulty socket connection.
   */
  static getSocketUrl() {
    const trigger = window.location.href.split("/");
    const socketSrc = trigger[trigger.length - 1];
    const regexp = new RegExp("^(?:[0-9]{1,3}.){3}[0-9]{1,3}:[0-9]{1,4}$");

    return regexp.test(socketSrc) ? socketSrc : "notconnected";
  }

  /**
   * Checks the url obtained from `getSocketUrl` and checks if valid.
   *
   * @param url - Optional, already processed URL (made to not re-run `getSocketUrl`)
   * @returns A boolean of URL validity.
   */
  static checkValidSockerUrl(url?: string) {
    const test = url || this.getSocketUrl();
    return !(test === "notconnected");
  }
}
