/* eslint-disable react-hooks/exhaustive-deps */
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
  const [, setIsConnected] = isConnectedHook;

  useEffect(() => {
    console.log("Hello");
    socket.on("connect", () => {
      setIsConnected(true);
      userProfile.UUID = uuid();
      console.log("Requesting register...");
      socket.emit("register", userProfile);
    });

    socket.on("regfailed", () => {
      console.log("RegFailed");
      setUserProfile({
        UUID: null,
        name: null,
      });
    });

    socket.on("regcomplete", (data: UserData) => {
      console.log("RegComplete");
      setUserProfile(data);
    });

    socket.on("pong", () => {
      console.log(new Date().toISOString());
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    window.addEventListener("beforeunload", () => {
      socket.emit("remove-user", userProfile);
    });

    return () => window.removeEventListener("beforeunload", () => {});
  }, []);

  return <></>;
}
