export type UserData = {
  socket_id: string | null;
  name: string | null;
  gradient: string;
};

export type MessageData = {
  from: string; // Sender Socket ID
  message?: string;
  to: string; // Sender Socket ID
};

type FileDropMetadata = {
  size: number;
  type: string;
  name: string;
  lastModified: number;
};

export type FileDropFile = {
  file: File | ArrayBuffer;
  metadata: FileDropMetadata;
};

export type FileDropData = {
  from: string; // Sender Socket ID
  files: FileDropFile[];
  to: string; // Sender Socket ID
};
