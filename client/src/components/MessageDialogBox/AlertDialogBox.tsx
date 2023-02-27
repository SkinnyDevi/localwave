import { AlertBoxProps } from "../../interfaces/ComponentTypes";
import { MessageData, FileDropData } from "../../interfaces/SocketDataTypes";
import styles from "./MessageDialogBox.module.css";

export default function AlertDialogBox({
  show,
  hideFunction,
  received,
}: AlertBoxProps) {
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
            From: <span>{received.from}</span>
          </button>
          <button className={styles.box_close} onClick={() => hideFunction()}>
            X
          </button>
        </div>
        {(received as FileDropData).files !== undefined ? (
          <div className={styles.tab_content}>
            <div className={styles.file_list}>
              <ul>
                {(received as FileDropData).files?.map((f) => {
                  return <li>{f.name}</li>;
                })}
              </ul>
            </div>
          </div>
        ) : (
          <div className={styles.tab_content}>
            <input readOnly value={(received as MessageData).message} />
          </div>
        )}
      </div>
    </div>
  );
}
