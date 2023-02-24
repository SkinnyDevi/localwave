export default interface UserData {
  UUID: string | null;
  name: string | null;
  userList?: UserData[];
}
