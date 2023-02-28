/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { MessageData, UserData } from "../interfaces/SocketDataTypes";
import { Socket } from "socket.io-client";

export default function useProfileInfo(
  socket: Socket
): [UserData, UserData[], boolean, MessageData] {
  const [profile, setUserProfile] = useState<UserData>(Object.create(null));
  const [userList, setUserList] = useState<UserData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [plainText, setPlainText] = useState<MessageData>();

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
      setPlainText(msg);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setUserProfile(Object.create(null));
      setUserList([]);
      setPlainText(Object.create(null));
    });
  }, []);

  return [profile, userList, isConnected, plainText!];
}
