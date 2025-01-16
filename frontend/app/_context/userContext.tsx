"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { TUserData } from "../_types/types";

const UserContext = createContext<TUserData | undefined>(undefined);

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
}

const emptyUser = {
  fullName: "",
  email: "",
  isAdmin: false,
  tokenVersion: "",
  createdAt: "",
  updatedAt: "",
};

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<TUserData>(emptyUser);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch("http://localhost:4040/api/user", {
        method: "GET",
        credentials: "include",
      });

      const resData = await res.json();
      if (resData.error) router.push("/login");

      setUserData(resData);
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={userData}>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};
