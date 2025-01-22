"use client";

import { logoutRequest } from "@/app/_utils/logoutRequest";
import { FormEvent, useEffect, useState } from "react";
import UserProfilePicture from "./_components/UserProfilePicture";
import AdminRequest from "./_components/AdminRequest";
import DeleteAccountRequest from "./_components/DeleteAccountRequest";
import { logoutAllRequest } from "@/app/_utils/logoutAllRequest";
import toast from "react-hot-toast";
import { fullNameSchema } from "@/app/_zod/formSchemas";
import { useUserData } from "../_hooks/useUserData";
import LoadingSpinner from "../_components/LoadingSpinner";
import { useUpdateFullName } from "../_hooks/useUpdateFullName";

export default function Account() {
  const { logout } = logoutRequest();
  const { logoutAll } = logoutAllRequest();
  const { data, isLoading } = useUserData();
  const [fullName, setFullName] = useState("");
  const updateFullNameMutation = useUpdateFullName();

  useEffect(() => {
    if (data && data.fullName) {
      setFullName(data.fullName);
    }
  }, [data]);

  const handleNameChange = async (e: FormEvent) => {
    e.preventDefault();
    if (data.fullName === fullName) return;

    const result = fullNameSchema.safeParse({ fullName });
    if (!result.success) {
      toast.error(result.error.errors[0].message || "Something went wrong");
      return;
    }

    try {
      await updateFullNameMutation.mutateAsync(fullName);
      toast.success("Full Name Updated");
    } catch (error) {
      toast.error("Failed to update Full Name");
    }
  };

  return (
    <>
      <div className="card bg-base-200 mt-20 mb-32 py-10 px-5 sm:px-10 container max-w-[700px] mx-auto">
        <h1 className="page-title mb-10">My Account</h1>
        <UserProfilePicture />
        {isLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  );
}
