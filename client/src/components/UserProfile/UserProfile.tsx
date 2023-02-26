import { UserProfileProps } from "../../interfaces/ComponentTypes";
import UserLogo from "../UserLogo";
import styles from "./UserProfile.module.css";

export default function UserProfile({
  type,
  user,
  openBoxFn,
}: UserProfileProps) {
  return (
    <div className={styles.user}>
      <div
        className={styles.user_logo}
        onClick={() => openBoxFn()}
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
