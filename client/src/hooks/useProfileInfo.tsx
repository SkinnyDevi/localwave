/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

import {
  FileDropData,
  MessageData,
  UserData,
} from "../interfaces/SocketDataTypes";

/**
 * Custom hook created to interact with the `Socket` instance passed.
 *
 * @param socket - The user's connected socket instance.
 * @returns The user's profile, connected user list, connection status, plain text transferred messages, `FileDrop` transferred files and a clear file function.
 */
export default function useProfileInfo(
  socket: Socket
): [UserData, UserData[], boolean, MessageData, FileDropData, Function] {
  const [profile, setUserProfile] = useState<UserData>(Object.create(null));
  const [userList, setUserList] = useState<UserData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [plainText, setPlainText] = useState<MessageData>();
  const [fileList, setFileList] = useState<FileDropData>();

  const clearFileList = () => setFileList(undefined);
  let user_list: UserData[] = [];
  let from: UserData = Object.create(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("regcomplete", (data: UserData) => {
      profile.name = data.name;
      profile.socket_id = data.socket_id;
      profile.gradient = data.gradient;
    });

    socket.on("user-list", (users: UserData[]) => {
      users = users.filter((u) => u.socket_id !== profile.socket_id);
      user_list = users;
      setUserList(users);
    });

    socket.on("pong", () => {
      console.log(new Date().toISOString());
    });

    socket.on("receivePlainText", (msg: MessageData) => {
      setPlainText(msg);
    });

    socket.on("filedrop-receiving", (files: FileDropData) => {
      from = user_list.find((u) => u.socket_id === files.from)!;
      files.received = false;
      from.logo_type = "loader";
      setFileList(files);
    });

    socket.on("filedrop-received", (files: FileDropData) => {
      files.received = true;
      from.logo_type = "success";
      setFileList(files);
      setTimeout(() => {
        from.logo_type = undefined;
        from = Object.create(null);
      }, 1500);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setUserProfile(Object.create(null));
      setUserList([]);
      setPlainText(Object.create(null));
    });
  }, []);

  return [profile, userList, isConnected, plainText!, fileList!, clearFileList];
}
