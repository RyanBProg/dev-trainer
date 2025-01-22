"use client";

import { useLogout } from "@/app/_hooks/useLogout";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import UserProfilePicture from "./_components/UserProfilePicture";
import AdminRequest from "./_components/AdminRequest";
import DeleteAccountRequest from "./_components/DeleteAccountRequest";
import { useUserContext } from "../_context/userContext";
import { useLogoutAll } from "@/app/_hooks/useLogoutAll";
import toast from "react-hot-toast";
import { fullNameSchema } from "@/app/_zod/formSchemas";
import { useUserData } from "../_hooks/useUserData";

export default function Account() {
  const router = useRouter();
  const { logout } = useLogout();
  const { logoutAll } = useLogoutAll();
  const { userData, setUserData } = useUserContext();
  const [fullName, setFullName] = useState("");

  const { data, isLoading } = useUserData();

  const handleNameChange = async (e: FormEvent) => {
    e.preventDefault();
    if (userData.fullName === fullName) return;

    const result = fullNameSchema.safeParse({ fullName });
    if (!result.success) {
      toast.error(result.error.errors[0].message || "Something went wrong");
      return;
    }

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
      <div className="card bg-base-200 mt-20 mb-32 py-10 px-5 sm:px-10 container max-w-[700px] mx-auto">
        <h1 className="page-title mb-10">My Account</h1>
        <UserProfilePicture />
        <div className="grid gap-4 mt-10">
          <form onSubmit={handleNameChange}>
            <label className="font-semibold">Full Name</label>
            <div className="relative max-w-[400px] mt-2">
              <input
                className="input input-bordered text-base capitalize w-full"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {data.fullName !== fullName && (
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
            <span className="text-xl">{data.email}</span>
          </div>
          <div className="grid">
            <span className="font-semibold">Member Since</span>
            <span className="text-xl">{data.createdAt.split("T")[0]}</span>
          </div>
          <div className="grid gap-2">
            <span className="font-semibold">Admin</span>
            <input
              type="checkbox"
              checked={data.isAdmin}
              className="checkbox checkbox-secondary"
              disabled={true}
            />
          </div>
        </div>
        <div className="mt-16 grid gap-10">
          <div className="grid gap-2">
            <span className="font-semibold">Logging Out</span>
            <div className="flex gap-4">
              <button className="btn  btn-primary" onClick={logout}>
                Logout
              </button>
              <button
                className="btn btn-outline btn-primary"
                onClick={logoutAll}>
                Logout On All Devices
              </button>
            </div>
          </div>
          <AdminRequest />
          <DeleteAccountRequest email={data.email} />
        </div>
      </div>
    </>
  );
}
