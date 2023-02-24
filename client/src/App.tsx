/* eslint-disable jsx-a11y/anchor-is-valid */

import io from "socket.io-client";
import { useState } from "react";

import UserSocket from "./websockets/UserSocket";
import UserData from "./interfaces/UserData";
import Background from "./components/Background/Background";
import UserLogo, { UserLogoProps } from "./components/UserLogo";

import styles from "./App.module.css";

const socket = io("http://localhost:3500/users");

function App() {
  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userList, setUserList] = useState<UserData[]>([]);

  const UserProfile = ({ type }: UserLogoProps) => {
    return (
      <div className={styles.user}>
        <UserLogo type={type} />
      </div>
    );
  };

  return (
    <div>
      <UserSocket
        userProfileHook={[userProfile, setUserProfile]}
        isConnectedHook={[isConnected, setIsConnected]}
        userListHook={[userList, setUserList]}
        socket={socket}
      />
      <Background />
      <header className={styles.header}>Local Wave</header>
      <div className={styles.userbox}>
        {userList.map((u: UserData) => {
          return <UserProfile key={u.UUID} />;
        })}
      </div>
    </div>
  );
}

export default App;
