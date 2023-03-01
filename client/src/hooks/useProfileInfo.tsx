/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

import {
  FileDropData,
  MessageData,
  UserData,
} from "../interfaces/SocketDataTypes";

export default function useProfileInfo(
  socket: Socket
): [UserData, UserData[], boolean, MessageData, FileDropData, Function] {
  const [profile, setUserProfile] = useState<UserData>(Object.create(null));
  const [userList, setUserList] = useState<UserData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [plainText, setPlainText] = useState<MessageData>();
  const [fileList, setFileList] = useState<FileDropData>();

  const clearFileList = () => setFileList(undefined);

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
      setUserList(users);
    });

    socket.on("pong", () => {
      console.log(new Date().toISOString());
    });

    socket.on("receivePlainText", (msg: MessageData) => {
      setFileList(undefined);
      setPlainText(msg);
    });

    socket.on("filedrop-receive", (files: FileDropData) => {
      setFileList(files);
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
