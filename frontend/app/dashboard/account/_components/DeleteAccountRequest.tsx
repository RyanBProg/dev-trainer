"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDeleteUser } from "../../_hooks/useDeleteUser";
import { useRouter } from "next/navigation";

export default function DeleteAccountRequest({ email }: { email: string }) {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteString, setDeleteString] = useState("");
  const deleteUserMutation = useDeleteUser();
  const router = useRouter();
  const deletePassword = `delete-${email}`;

  const closeForm = () => {
    setFormOpen(false);
    setDeleteString("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (deleteString !== deletePassword) {
      toast.error("Delete string must match");
      return;
    }

    try {
      await deleteUserMutation.mutateAsync();
      router.push("/signup");
    } catch (error) {
      toast.error("Failed to Delete User");
      console.log(error);
    }
  };

  return (
    <div className="grid gap-2">
      <span className="font-semibold">Deleting Your Account</span>
      <button
        className="btn btn-error w-fit"
        onClick={() => setFormOpen((prev) => !prev)}>
        Delete Account
      </button>
      {formOpen && (
        <form
          className="flex flex-col sm:flex-row sm:items-end gap-5 my-4"
          onSubmit={handleSubmit}>
          <div className="grid gap-3 relative">
            <label>
              Please type<span className="font-bold"> {deletePassword} </span>
              to delete your account
            </label>
            <div className="relative w-full">
              <input
                className="input input-bordered text-base text-base-content w-full pr-9"
                type="text"
                required
                value={deleteString}
                onChange={(e) => setDeleteString(e.target.value)}
              />
              <button
                type="button"
                className="absolute top-0 right-0 btn btn-error btn-xs"
                onClick={closeForm}>
                X
              </button>
            </div>
          </div>
          <button className="btn btn-error btn-outline w-fit" type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
