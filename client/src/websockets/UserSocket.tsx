import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { v4 as uuid } from "uuid";

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
  const [userProfile, setUserProfile] = userProfileHook;
  const [isConnected, setIsConnected] = isConnectedHook;

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      userProfile.UUID = uuid();
      console.log(userProfile);
      socket.emit("register", userProfile);
    });

    socket.on("regfailed", () => {
      console.log("Failed");
      setUserProfile({
        UUID: null,
        name: null,
      });
    });

    socket.on("regcomplete", (data: UserData) => {
      setUserProfile(data);
    });

    socket.on("pong", () => {
      console.log(new Date().toISOString());
    });

    socket.on("user-removed", () => {
      setUserProfile({ UUID: null, name: null });
      socket.disconnect();
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });
  }, []);

  return <></>;
}
