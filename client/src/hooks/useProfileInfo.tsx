/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import UserData from "../interfaces/UserData";
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
      setUserProfile(data);
    });

    socket.on("user-list", (users: UserData[]) => {
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
