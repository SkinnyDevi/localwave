import { UserData } from "./SocketDataTypes";

export type UserLogoProps = {
  type?: string;
};

export type UserProfileProps = {
  type?: string;
  user: UserData;
};
