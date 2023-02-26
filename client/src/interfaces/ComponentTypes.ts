import { UserData } from "./SocketDataTypes";

export type UserLogoProps = {
  type?: string;
};

export type UserProfileProps = {
  type?: string;
  user: UserData;
};

export type BackgroundProps = {
  hasUsers: boolean;
};
