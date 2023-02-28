/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import io from "socket.io-client";
import { useEffect, useState } from "react";

import Background from "./components/Background/Background";
import useProfileInfo from "./hooks/useProfileInfo";
import MessageDialogBox from "./components/MessageDialogBox/MessageDialogBox";
import UserList from "./components/UserProfile/UserList";
import styles from "./App.module.css";
import { DialogUserCtxProvider } from "./hooks/DialogUserContext";
import AlertDialogBox from "./components/MessageDialogBox/AlertDialogBox";

const socket = io("http://localhost:3500/users", { autoConnect: false }); // Needed for safari to autoconnect.

export default function App() {
  const [userProfile, userList, , plainText] = useProfileInfo(socket);
  const [showMsgBox, setMsgBox] = useState(false);
  const [showDialogBox, setDialogBox] = useState(false);

  useEffect(() => {
    socket.connect(); // Needed for safari to autoconnect.
  }, []);

  useEffect(() => {
    if (plainText !== null && plainText !== undefined) {
      plainText.from = userList.find(
        (u) => u.socket_id === plainText.from
      )?.name!;
      if (plainText.from !== undefined) setDialogBox(true);
      else console.log("name not found.");
    }
  }, [plainText]);

  return (
    <DialogUserCtxProvider>
      <MessageDialogBox
        show={showMsgBox}
        hideFunction={() => {
          setMsgBox(false);
          console.log("hide");
        }}
        myProfile={userProfile}
        socket={socket}
      />
      <AlertDialogBox
        show={showDialogBox}
        receivedPlainText={plainText}
        hideFunction={() => setDialogBox(false)}
        userList={userList}
      />
      <Background hasUsers={userList.length > 0} />
      <header className={styles.header}>Local Wave</header>
      <div className={styles.userbox_center}>
        <div className={styles.userbox}>
          <UserList list={userList} openBoxFn={() => setMsgBox(true)} />
        </div>
      </div>
      <footer className={styles.footer}>
        <p>
          You are <span>{userProfile.name?.replace("_", " ")}</span>
        </p>
        <p>Connect to the same network as other devices to transfer files.</p>
      </footer>
    </DialogUserCtxProvider>
  );
}
