/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import io from "socket.io-client";
import { useEffect, useState } from "react";

import Background from "./components/Background/Background";
import useProfileInfo from "./hooks/useProfileInfo";
import { MessageData } from "./interfaces/SocketDataTypes";
import MessageDialogBox from "./components/MessageDialogBox/MessageDialogBox";
import UserList from "./components/UserProfile/UserList";
import styles from "./App.module.css";

const socket = io("http://192.168.1.177:3500/users");

function App() {
  const [userProfile, userList, , plainText] = useProfileInfo(socket);
  const [showBox, setBox] = useState(false);

  const sendPlainText = (socket_id: string) => {
    const text = "Hello";
    const msgData: MessageData = {
      from: userProfile.socket_id!,
      to: socket_id,
      message: text,
    };
    socket.emit("sendPlainText", msgData);
  };

  useEffect(() => {
    if (plainText !== null && plainText !== undefined) {
      plainText.from = userList.find(
        (u) => u.socket_id === plainText.from
      )?.name!;
      console.log(plainText);
    }
  }, [plainText]);

  return (
    <>
      <MessageDialogBox show={showBox} hideFunction={() => setBox(false)} />
      <Background hasUsers={userList.length > 0} />
      <header className={styles.header}>Local Wave</header>
      <div className={styles.userbox_center}>
        <div className={styles.userbox}>
          <UserList list={userList} openBoxFn={() => setBox(true)} />
        </div>
      </div>
      <footer className={styles.footer}>
        <p>
          You are <span>{userProfile.name?.replace("_", " ")}</span>
        </p>
        <p>Connect to the same network as other devices to transfer files.</p>
      </footer>
    </>
  );
}

export default App;
