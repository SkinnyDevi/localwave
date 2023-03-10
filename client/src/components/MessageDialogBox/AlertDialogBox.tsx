import { AlertBoxProps } from "../../interfaces/ComponentTypes";
import CommonUtils from "../../utils";
import styles from "./MessageDialogBox.module.css";

/**
 * Alert dialog used to display the information received from the socket.
 *
 * @param show - Trigger the show or hide animation.
 * @param hideFunction - Function passed down to close the dialog.
 * @param receivedPlainText - The `MessageData` received from the socket.
 * @param receivedFiles - The `FileDropData` received from the socket.
 * @param userList - The current users available in the room.
 */
export default function AlertDialogBox({
  show,
  hideFunction,
  receivedPlainText,
  receivedFiles,
  userList,
}: AlertBoxProps) {
  const findReceiverName = (socket_id: string) => {
    return userList.find((u) => u.socket_id === socket_id)?.name!;
  };

  const getReceiver = () => {
    if (receivedFiles !== undefined)
      return findReceiverName(receivedFiles.from);

    if (receivedPlainText !== undefined)
      return findReceiverName(receivedPlainText.from);

    return "Name couldn't be fetched.";
  };

  const getReceiverType = () => {
    if (receivedFiles !== undefined) return "FileDropData";
    if (receivedPlainText !== undefined) return "MessageData";

    return null;
  };

  const ReceivedComponent = () => {
    if (getReceiverType() === null) return <></>;

    if (getReceiverType()! === "FileDropData") {
      return (
        <div className={styles.tab_content}>
          <div className={styles.file_list}>
            <ul>
              {CommonUtils.parseFileDrop(receivedFiles!.files).map((f) => {
                const fileUrl = URL.createObjectURL(f);
                return (
                  <li key={f.name} className={styles.file}>
                    <span>{f.name}</span>
                    <a href={fileUrl} download={f.name} id={f.name}>
                      &nbsp;
                    </a>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      id={f.name + "_view"}
                    >
                      &nbsp;
                    </a>
                    <div>
                      <button
                        onClick={() =>
                          document.getElementById(f.name + "_view")?.click()
                        }
                      >
                        View
                      </button>
                      <button
                        onClick={() => document.getElementById(f.name)?.click()}
                      >
                        Download
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.tab_content}>
        <textarea readOnly value={receivedPlainText?.message} />
      </div>
    );
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
          <button disabled className={styles.from_readonly}>
            From: <span>{getReceiver()?.replace("_", " ")}</span>
          </button>
          <button className={styles.box_close} onClick={() => hideFunction()}>
            X
          </button>
        </div>
        <ReceivedComponent />
      </div>
    </div>
  );
}
