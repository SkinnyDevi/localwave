import { UserData } from "./SocketDataTypes";

export type UserLogoProps = {
  type?: string;
};

export type UserProfileProps = {
  type?: string;
  user: UserData;
  openBoxFn: Function;
};

export type BackgroundProps = {
  hasUsers: boolean;
};

export type MessageBoxProps = {
  show: boolean;
  hideFunction: Function;
};

export type UserProfileListProps = {
  list: UserData[];
  openBoxFn: Function;
};
