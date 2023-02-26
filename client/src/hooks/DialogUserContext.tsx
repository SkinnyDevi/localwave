import { createContext, useState } from "react";
import { UserData } from "../interfaces/SocketDataTypes";

type DialogUserCtxType = {
  dialogUser: UserData;
  setDialogUser: (u: UserData) => void;
};

export const DialogUserCtx = createContext<DialogUserCtxType>(
  Object.create(null)
);

export function DialogUserCtxProvider({ children }: React.PropsWithChildren) {
  const [dialogUser, setDialogUser] = useState<UserData>(Object.create(null));

  return (
    <DialogUserCtx.Provider value={{ dialogUser, setDialogUser }}>
      {children}
    </DialogUserCtx.Provider>
  );
}
