import { useContext } from "react";
import { UserProfileProps } from "../../interfaces/ComponentTypes";
import UserLogo from "../UserLogo/UserLogo";
import styles from "./UserProfile.module.css";
import { DialogUserCtx } from "../../hooks/DialogUserContext";

export default function UserProfile({
  type,
  user,
  openBoxFn,
}: UserProfileProps) {
  const { setDialogUser } = useContext(DialogUserCtx);

  return (
    <div className={styles.user}>
      <div
        className={styles.user_logo}
        onClick={() => {
          setDialogUser(user);
          openBoxFn();
        }}
        style={{ background: user.gradient }}
      >
        <UserLogo type={type} />
      </div>
      <div className={styles.user_name}>
        <p>{user.name?.replace("_", " ")}</p>
      </div>
    </div>
  );
}
