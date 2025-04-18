"use client";

import { FormEvent, useEffect, useState } from "react";
import UserProfilePicture from "@/components/dashboard/account/UserProfilePicture";
import AdminRequest from "@/components/dashboard/account/AdminRequest";
import DeleteAccountRequest from "@/components/dashboard/account/DeleteAccountRequest";
import toast from "react-hot-toast";
import { fullNameSchema } from "@/utils/zod/formSchemas";
import { useUserData } from "@/hooks/useUserData";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { useUpdateFullName } from "@/hooks/useUpdateFullName";
import { useLogout } from "@/hooks/useLogout";
import { useLogoutAll } from "@/hooks/useLogoutAll";

export default function Account() {
  const { data, isLoading } = useUserData();
  const [fullName, setFullName] = useState("");
  const updateFullNameMutation = useUpdateFullName();
  const logoutMutation = useLogout();
  const logoutAllMutation = useLogoutAll();

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
      toast.error(result.error.errors[0].message || "User update failed");
      return;
    }

    try {
      await updateFullNameMutation.mutateAsync(fullName);
      toast.success("Full Name Updated");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update Full Name");
      }
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
                  <button
                    className="btn btn-primary"
                    onClick={async () => await logoutMutation.mutateAsync()}>
                    {logoutMutation.isPending ? (
                      <LoadingSpinner size="md" />
                    ) : (
                      "Logout"
                    )}
                  </button>
                  <button
                    className="btn btn-outline btn-primary"
                    onClick={async () => await logoutAllMutation.mutateAsync()}>
                    {logoutAllMutation.isPending ? (
                      <LoadingSpinner size="md" />
                    ) : (
                      "Logout On All Devices"
                    )}
                  </button>
                </div>
              </div>
              {!data.isAdmin && <AdminRequest />}
              <DeleteAccountRequest email={data.email} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
