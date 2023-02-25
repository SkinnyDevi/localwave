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

  const UserProfile = ({ type, user }: UserProfileProps) => {
    return (
      <div className={styles.user}>
        <UserLogo type={type} />
        <p>{user.name}</p>
      </div>
    );
  };

  return (
    <div>
      <Background />
      <header className={styles.header}>Local Wave</header>
      <header style={{ marginTop: "50px" }} className={styles.header}>
        {userProfile.socket_id}
      </header>
      <header style={{ marginTop: "200px" }} className={styles.header}>
        {userProfile.name?.replace("_", " ")}
      </header>
      <div className={styles.userbox}>
        {userList.length > 0
          ? userList.map((u: UserData) => {
              return <UserProfile key={u.socket_id} user={u} />;
            })
          : null}
      </div>
    </div>
  );
}

export default App;
