import { useContext, useState } from "react";

import { MessageBoxProps } from "../../interfaces/ComponentTypes";
import { DialogUserCtx } from "../../hooks/DialogUserContext";
import CommonUtils from "../../utils";
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
  const [fileList, setFileList] = useState<FileList>();

  const hide = () => {
    hideFunction();
    setDialogUser(Object.create(null));
    setPlainText("");
    setFileList(undefined);
  };

  const emitFiles = () => {
    if (fileList === undefined) return;
    CommonUtils.emitFileDrop(socket, dialogUser, fileList);
    hide();
  };

  const sendPlainText = () => {
    socket.emit("sendPlainText", {
      from: myProfile.socket_id!,
      to: dialogUser.socket_id!,
      message: plainText!,
    });
    hide();
  };

  const checkAndAddFiles = (files: FileList) => {
    if (files === null) return;

    for (let f of Array.from(files))
      if (f.size > 3e9) throw new Error(`File ${f.name} is bigger than 3GB.`);

    setFileList(files);
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
              {fileList !== undefined
                ? Array.from(fileList!).map((f, i) => {
                    return <li key={i}>{f.name}</li>;
                  })
                : null}
            </ul>
          </div>
          <div className={styles.send_buttons}>
            <input
              type={"file"}
              onChange={(e) => checkAndAddFiles(e.target.files!)}
              className={styles.file_input}
              id="file-input"
              multiple
            />
            <button
              onClick={() => document.getElementById("file-input")!.click()}
            >
              Add Files
            </button>
            <button
              onClick={() => emitFiles()}
              disabled={fileList === undefined}
            >
              Send Files
            </button>
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
