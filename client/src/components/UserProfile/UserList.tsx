import { UserProfileListProps } from "../../interfaces/ComponentTypes";
import { UserData } from "../../interfaces/SocketDataTypes";
import UserProfile from "./UserProfile";

export default function UserList({ list, openBoxFn }: UserProfileListProps) {
  return (
    <>
      {list.length > 0 ? (
        list.map((u: UserData) => {
          return (
            <UserProfile
              key={u.socket_id}
              user={u}
              openBoxFn={() => openBoxFn()}
              type={u.logo_type}
            />
          );
        })
      ) : (
        <></>
      )}
    </>
  );
}
