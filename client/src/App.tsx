/* eslint-disable jsx-a11y/anchor-is-valid */
import io from "socket.io-client";

import Background from "./components/Background/Background";
import UserLogo from "./components/UserLogo";

import styles from "./App.module.css";
import useProfileInfo from "./hooks/useProfileInfo";
import { UserData } from "./interfaces/SocketDataTypes";
import { UserProfileProps } from "./interfaces/ComponentTypes";

const socket = io("http://192.168.1.177:3500/users");

function App() {
  const [userProfile, userList] = useProfileInfo(socket);

  const hexToRGB = (hex: string) => {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const UserProfile = ({ type, user }: UserProfileProps) => {
    let randomHex2: string =
      "#" + Math.floor(Math.random() * 16777215).toString(16);
    let randomHex1: string =
      "#" + Math.floor(Math.random() * 16777215).toString(16);

    let gradient = `linear-gradient(45deg, ${hexToRGB(
      randomHex1
    )} 0%, ${hexToRGB(randomHex2)} 100%)`;

    return (
      <div className={styles.user}>
        <div className={styles.user_logo} style={{ background: gradient }}>
          <UserLogo type={type} />
        </div>
        <div className={styles.user_name}>
          <p>{user.name?.replace("_", " ")}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Background />
      <header className={styles.header}>Local Wave</header>
      <div className={styles.userbox_center}>
        <div className={styles.userbox}>
          {userList.length > 0
            ? userList.map((u: UserData) => {
                return <UserProfile key={u.socket_id} user={u} />;
              })
            : null}
        </div>
      </div>
      <footer className={styles.footer}>
        <p>
          You are <span>{userProfile.name?.replace("_", " ")}</span>
        </p>
        <p>Connect to the same network as other devices to transfer files.</p>
      </footer>
    </>
  );
}

export default App;
