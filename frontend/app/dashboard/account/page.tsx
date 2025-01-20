"use client";

import { useLogout } from "@/app/_hooks/useLogout";
import { TUserData } from "@/app/_types/types";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import UserProfilePicture from "./_components/UserProfilePicture";
import AdminRequest from "./_components/AdminRequest";
import DeleteAccountRequest from "./_components/DeleteAccountRequest";
import { useUserContext } from "../_context/userContext";

export default function Account() {
  const router = useRouter();
  const { logout } = useLogout();
  const { userData, setUserData } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch("http://localhost:4040/api/user", {
        method: "GET",
        credentials: "include",
      });

      const resData = await res.json();
      if (resData.error) router.push("/login");

      setUserData(resData);
      setFullName(resData.fullName);
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const handleNameChange = async (e: FormEvent) => {
    e.preventDefault();
    if (userData.fullName === fullName) return;

    try {
      const res = await fetch("http://localhost:4040/api/user/full-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
        credentials: "include",
      });

      const newData = await res.json();
      if (newData.error) {
        throw new Error(newData.error);
      }

      setUserData((prev) => ({ ...prev, fullName: newData.userData.fullName }));
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="mt-44 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div className="card bg-base-300 shadow-xl max-w-[600px] mx-auto my-20 p-10">
        <h1 className="font-bold text-3xl text-white text-center">
          My Account
        </h1>
        <UserProfilePicture />
        <div className="grid gap-4 mt-10">
          <form onSubmit={handleNameChange}>
            <label className="font-semibold">Full Name</label>
            <div className="relative mt-2">
              <input
                className="input w-full capitalize text-lg"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {userData.fullName !== fullName && (
                <button
                  type="submit"
                  className="btn btn-success btn-sm absolute right-2 top-2">
                  Save
                </button>
              )}
            </div>
          </form>
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
        <div className="mt-16 grid gap-10">
          <div className="grid gap-2">
            <span className="font-semibold">Logging Out</span>
            <div className="flex gap-4">
              <button className="btn btn-outline" onClick={logout}>
                Logout
              </button>
              <button className="btn btn-outline">Logout On All Devices</button>
            </div>
          </div>
          <AdminRequest />
          <DeleteAccountRequest email={userData.email} />
        </div>
      </div>
    </>
  );
}
