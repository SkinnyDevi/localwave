/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Socket } from "socket.io-client";

import UserData from "../interfaces/UserData";

interface UserSocketProps {
  userProfileHook: [
    UserData | null,
    React.Dispatch<React.SetStateAction<UserData | null>>
  ];
  isConnectedHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  userListHook: [UserData[], React.Dispatch<React.SetStateAction<UserData[]>>];
  socket: Socket;
}

export default function UserSocket({
  userProfileHook,
  isConnectedHook,
  userListHook,
  socket,
}: UserSocketProps) {
  const [userProfile, setUserProfile] = userProfileHook;
  const [, setIsConnected] = isConnectedHook;
  const [, setUserList] = userListHook;

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("regcomplete", (data: UserData) => {
      console.log("ME: ", data.UUID);
      data.userList!.forEach((u: UserData) => {
        if (u.UUID === data.UUID) {
          data.userList!.splice(data.userList!.indexOf(u));
          return;
        }
      });
      console.log(data.userList);
      setUserProfile(data);
    });

    socket.on("user-list", (users: UserData[]) => {
      console.log("UPDATE LIST ME: ", userProfile);
      users.forEach((u: UserData) => {
        if (u.UUID === userProfile!.UUID) {
          users.splice(users.indexOf(u));
          return;
        }
      });

      setUserList(users);
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
