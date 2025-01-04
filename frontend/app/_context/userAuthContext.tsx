"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

const initialUser: TUserContext = {
  fullName: "",
  email: "",
  custom: {
    shortcuts: [],
  },
};

type TUserContext = {
  fullName: string;
  email: string;
  custom: {
    shortcuts: TShortcut[];
  };
};

type TShortcut = {
  type: string;
  keys: string[];
  shortDescription: string;
  description: string;
};

type TAuthContext = {
  authUser: TUserContext | undefined;
  setAuthUser: Dispatch<SetStateAction<TUserContext | undefined>>;
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
  const [authUser, setAuthUser] = useState<TUserContext | undefined>();

  return (
    <UserAuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </UserAuthContext.Provider>
  );
};
