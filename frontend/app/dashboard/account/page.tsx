"use client";

import { useLogout } from "@/app/_hooks/useLogout";
import { TUserData } from "@/app/_types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const emptyUser = {
  fullName: "",
  email: "",
  isAdmin: false,
  tokenVersion: "",
  createdAt: "",
  updatedAt: "",
};

export default function Account() {
  const router = useRouter();
  const { logout } = useLogout();
  const [userData, setUserData] = useState<TUserData>(emptyUser);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-28">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div className="card bg-base-300 shadow-xl max-w-[600px] mx-auto mt-20 p-10">
        <h1 className="font-bold text-3xl text-white">My Account</h1>
        <div className="grid gap-4 mt-10">
          <div className="grid">
            <span className="font-semibold">Full Name</span>
            <span className="text-xl capitalize">{userData.fullName}</span>
          </div>
          <div className="grid">
            <span className="font-semibold">Email</span>
            <span className="text-xl">{userData.email}</span>
          </div>
          <div className="grid">
            <span className="font-semibold">Member Since</span>
            <span className="text-xl">{userData.createdAt.split("T")[0]}</span>
          </div>
          <div className="grid gap-2">
            <span className="font-semibold">Admin</span>
            <input
              type="checkbox"
              checked={userData.isAdmin}
              className="checkbox"
              disabled={true}
            />
          </div>
        </div>
        <div className="mt-10 flex gap-4">
          <button className="btn btn-accent" onClick={logout}>
            Logout
          </button>
          <button className="btn btn-outline">Admin Request</button>
          <button className="btn btn-outline btn-error">Delete Account</button>
        </div>
      </div>
    </>
  );
}
