import { useContext, useState } from "react";
import { MessageBoxProps } from "../../interfaces/ComponentTypes";
import { MessageData } from "../../interfaces/SocketDataTypes";
import { DialogUserCtx } from "../../hooks/DialogUserContext";
import styles from "./MessageDialogBox.module.css";

export default function MessageDialogBox({
  show,
  hideFunction,
  myProfile,
  socket,
}: MessageBoxProps) {
  const [showTextTab, setTextTab] = useState(false);
  const { dialogUser, setDialogUser } = useContext(DialogUserCtx);

  const sendPlainText = () => {
    const text = "Hello";
    const msgData: MessageData = {
      from: myProfile.socket_id!,
      to: dialogUser.socket_id!,
      message: text,
    };
    socket.emit("sendPlainText", msgData);
  };

  return (
    <div
      className={styles.box}
      style={{ opacity: show ? 1 : 0, zIndex: show ? 1 : 0 }}
    >
      <div
        className={styles.message_box}
        style={{
          transform: `scale(${show ? 1 : 0})`,
          WebkitTransform: `scale(${show ? 1 : 0})`,
        }}
      >
        <div className={styles.tabs}>
          <button onClick={() => setTextTab(false)}>Files</button>
          <button onClick={() => setTextTab(true)}>Text</button>
          <button
            className={styles.box_close}
            onClick={() => {
              hideFunction();
              setDialogUser(Object.create(null));
            }}
          >
            X
          </button>
        </div>
        <div
          className={styles.tab_content}
          style={{ display: !showTextTab ? "flex" : "none" }}
        >
          <div className={styles.send_buttons}>
            <button>Add Files</button>
            <button>Send Files</button>
          </div>
          <div className={styles.file_list}>
            <ul>
              <li>Hello</li>
              <li>Hello</li>
            </ul>
          </div>
        </div>
        <div
          className={styles.tab_content}
          style={{ display: showTextTab ? "flex" : "none" }}
        >
          <div className={styles.send_buttons}>
            <button onClick={() => sendPlainText()}>Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
}
