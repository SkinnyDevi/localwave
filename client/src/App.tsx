/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import io from "socket.io-client";
import { useEffect, useState } from "react";

import Background from "./components/Background/Background";
import useProfileInfo from "./hooks/useProfileInfo";
import MessageDialogBox from "./components/MessageDialogBox/MessageDialogBox";
import UserList from "./components/UserProfile/UserList";
import { DialogUserCtxProvider } from "./hooks/DialogUserContext";
import AlertDialogBox from "./components/MessageDialogBox/AlertDialogBox";
import styles from "./App.module.css";

const socket = io("http://192.168.1.177:3500/users", { autoConnect: false }); // Needed for safari to autoconnect.

export default function App() {
  const [userProfile, userList, , plainText, fileList, clearFileList] =
    useProfileInfo(socket);
  const [showMsgBox, setMsgBox] = useState(false);
  const [showDialogBox, setDialogBox] = useState(false);

  useEffect(() => {
    // Needed for safari to autoconnect.
    // This is because if autoconnect is set to true, on MacOS execution
    // it will try to register the socket events first and then connect,
    // but since the socket hasn't yet connected, it doesn't register the events.
    socket.connect();
  }, []);

  useEffect(() => {
    if (plainText === null || plainText === undefined) return;
    if (!showDialogBox) setDialogBox(true);
  }, [plainText]);

  useEffect(() => {
    if (fileList === null || fileList === undefined) return;
    if (!showDialogBox) setDialogBox(true);
  }, [fileList]);

  return (
    <DialogUserCtxProvider>
      <MessageDialogBox
        show={showMsgBox}
        hideFunction={() => setMsgBox(false)}
        myProfile={userProfile}
        socket={socket}
      />
      <AlertDialogBox
        show={showDialogBox}
        receivedPlainText={plainText}
        receivedFiles={fileList}
        hideFunction={() => {
          setDialogBox(false);
          clearFileList();
        }}
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
