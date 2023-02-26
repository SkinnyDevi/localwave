export type UserData = {
  socket_id: string | null;
  name: string | null;
  gradient: string;
};

export type MessageData = {
  from: string; // Sender Socket ID
  message: string;
  to: string; // Sender Socket ID
};
