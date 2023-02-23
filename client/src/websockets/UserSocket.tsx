/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Socket } from "socket.io-client";

import UserData from "../interfaces/UserData";

interface UserSocketProps {
  userProfileHook: [UserData, React.Dispatch<React.SetStateAction<UserData>>];
  isConnectedHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  socket: Socket;
}

export default function UserSocket({
  userProfileHook,
  isConnectedHook,
  socket,
}: UserSocketProps) {
  const [, setUserProfile] = userProfileHook;
  const [, setIsConnected] = isConnectedHook;

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("regcomplete", (data: UserData) => {
      setUserProfile(data);
    });

    socket.on("pong", () => {
      console.log(new Date().toISOString());
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });
  }, []);

  return <></>;
}
