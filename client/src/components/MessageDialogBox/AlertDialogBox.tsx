import { AlertBoxProps } from "../../interfaces/ComponentTypes";
import styles from "./MessageDialogBox.module.css";

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
              {receivedFiles?.files?.map((f) => {
                return <li>{f.name}</li>;
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
          <button disabled>
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
