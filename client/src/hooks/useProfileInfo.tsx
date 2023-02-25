/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { UserData } from "../interfaces/SocketDataTypes";
import { Socket } from "socket.io-client";

const dummy = {
  socket_id: null,
  name: null,
};

export default function useProfileInfo(
  socket: Socket
): [UserData, UserData[], boolean] {
  const [profile, setUserProfile] = useState<UserData>(dummy);
  const [userList, setUserList] = useState<UserData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("regcomplete", (data: UserData) => {
      profile.name = data.name;
      profile.socket_id = data.socket_id;
    });

    socket.on("user-list", (users: UserData[]) => {
      users = users.filter((u) => u.socket_id !== profile.socket_id);
      setUserList(users);
    });

    socket.on("pong", () => {
      console.log(new Date().toISOString());
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setUserProfile(dummy);
      setUserList([]);
    });
  }, [socket]);

  return [profile, userList, isConnected];
}
