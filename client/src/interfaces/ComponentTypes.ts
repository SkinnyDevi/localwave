import { Socket } from "socket.io-client";
import { FileDropData, UserData, MessageData } from "./SocketDataTypes";

export type UserLogoProps = {
  type?: string;
};

export type BackgroundProps = {
  hasUsers: boolean;
};

export type UserProfileProps = {
  type?: string;
  user: UserData;
  openBoxFn: Function;
};

export type UserProfileListProps = {
  list: UserData[];
  openBoxFn: Function;
};

export type MessageBoxProps = {
  show: boolean;
  hideFunction: Function;
  myProfile: UserData;
  socket: Socket;
};

export type AlertBoxProps = {
  show: boolean;
  hideFunction: Function;
  receivedFiles?: FileDropData;
  receivedPlainText?: MessageData;
  userList: UserData[];
};
