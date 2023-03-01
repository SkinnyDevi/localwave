import { createContext, useState } from "react";
import { UserData } from "../interfaces/SocketDataTypes";

type DialogUserCtxType = {
  dialogUser: UserData;
  setDialogUser: (u: UserData) => void;
};

/**
 * Context used to link the interacted user's information and the `MessageDialogBox` component.
 */
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
