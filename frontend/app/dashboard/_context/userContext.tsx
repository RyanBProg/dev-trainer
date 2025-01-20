"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { TUserData } from "@/app/_types/types";
import defaultProfileIcon from "@/app/_assets/icons/user.png";
import { StaticImageData } from "next/image";

type ContextValue = {
  userData: TUserData;
  profilePicture: string | StaticImageData;
  setProfilePicture: Dispatch<SetStateAction<string | StaticImageData>>;
};

const UserContext = createContext<ContextValue | undefined>(undefined);

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
  const [profilePicture, setProfilePicture] = useState<
    string | StaticImageData
  >(defaultProfileIcon);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user data and profile picture concurrently
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, profileResponse] = await Promise.all([
          fetch("http://localhost:4040/api/user", {
            method: "GET",
            credentials: "include",
          }),
          fetch("http://localhost:4040/api/user/profile-picture", {
            method: "GET",
            credentials: "include",
          }),
        ]);

        // Handle user data response
        const userData = await userResponse.json();
        if (userData.error) {
          router.push("/login");
          return;
        }
        setUserData(userData);

        // Handle profile picture response
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.profilePicture) {
            setProfilePicture(profileData.profilePicture);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <UserContext.Provider
      value={{ userData, profilePicture, setProfilePicture }}>
      {isLoading ? (
        <div className="mt-44 flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};
