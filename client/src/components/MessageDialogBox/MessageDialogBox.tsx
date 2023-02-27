import { useContext, useEffect, useState } from "react";
import { MessageBoxProps } from "../../interfaces/ComponentTypes";
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
  const [plainText, setPlainText] = useState("");

  const hide = () => {
    hideFunction();
    setDialogUser(Object.create(null));
    setPlainText("");
  };

  const sendPlainText = () => {
    socket.emit("sendPlainText", {
      from: myProfile.socket_id!,
      to: dialogUser.socket_id!,
      message: plainText!,
    });
    hide();
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
          <button className={styles.box_close} onClick={() => hide()}>
            X
          </button>
        </div>
        <div
          className={styles.tab_content}
          style={{ display: !showTextTab ? "flex" : "none" }}
        >
          <div className={styles.file_list}>
            <ul>
              <li>Hello</li>
              <li>{window.screen.width}</li>
            </ul>
          </div>
          <div className={styles.send_buttons}>
            <button onClick={() => console.log("add")}>Add Files</button>
            <button onClick={() => console.log("send")}>Send Files</button>
          </div>
        </div>
        <div
          className={styles.tab_content}
          style={{ display: showTextTab ? "flex" : "none" }}
        >
          <textarea
            placeholder="Heya! You hear me?"
            onChange={(e) => setPlainText(e.target.value)}
            value={plainText}
            maxLength={2000}
          />
          <div className={styles.send_buttons}>
            <button
              onClick={() => sendPlainText()}
              disabled={!(plainText.length > 0)}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
