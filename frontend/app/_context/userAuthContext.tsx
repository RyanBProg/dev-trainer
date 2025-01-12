"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { TUserContext } from "../_types/types";

export const initialUserContext: TUserContext = {
  fullName: "",
  isAdmin: false,
  custom: {
    shortcuts: [],
  },
};

type TAuthContext = {
  authUser: TUserContext | undefined;
  setAuthUser: Dispatch<SetStateAction<TUserContext>>;
};

const UserAuthContext = createContext<TAuthContext | undefined>(undefined);

export function useUserAuthContext() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error(
      "useUserAuthContext must be used within a UserAuthContextProvider"
    );
  }
  return context;
}

type TAuthContextProviderProps = {
  children: ReactNode;
};

export const UserAuthContextProvider = ({
  children,
}: TAuthContextProviderProps) => {
  const [authUser, setAuthUser] = useState<TUserContext>(initialUserContext);

  return (
    <UserAuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </UserAuthContext.Provider>
  );
};
