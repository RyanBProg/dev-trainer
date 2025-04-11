"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type TDeleteString = {
  input: string;
};

export default function DeleteAccountRequest({ email }: { email: string }) {
  const [formOpen, setFormOpen] = useState(false);
  const deleteUserMutation = useDeleteUser();
  const router = useRouter();
  const deletePassword = `delete-${email}`;
  const { register, handleSubmit, reset } = useForm<TDeleteString>();

  const closeForm = () => {
    setFormOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<TDeleteString> = async (data) => {
    if (data.input !== deletePassword) {
      toast.error("Delete string must match");
      return;
    }

    try {
      await deleteUserMutation.mutateAsync();
      toast.success("Account Deleted");
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
          onSubmit={handleSubmit(onSubmit)}>
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
                {...register("input")}
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
