"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useUserAdminRequest } from "@/hooks/useUserAdminRequest";
import { SubmitHandler, useForm } from "react-hook-form";

type TAdminString = {
  input: string;
};

export default function AdminRequest() {
  const [formOpen, setFormOpen] = useState(false);
  const adminRequestMutation = useUserAdminRequest();
  const { register, handleSubmit, reset } = useForm<TAdminString>();

  const closeForm = () => {
    setFormOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<TAdminString> = async (data) => {
    try {
      const res = await adminRequestMutation.mutateAsync(data.input);
      if (res.error) {
        toast.error("Admin password incorrect");
        return;
      }
      setFormOpen(false);
      reset();
      toast.success("User now an admin");
    } catch (error) {
      toast.error("Failed Admin Request");
      console.log(error);
    }
  };

  return (
    <div className="grid gap-2">
      <span className="font-semibold">Requesting Admin Rights</span>
      <button
        className="btn btn-primary w-fit"
        onClick={() => setFormOpen((prev) => !prev)}>
        Admin Request
      </button>
      {formOpen && (
        <form
          className="flex flex-col sm:flex-row sm:items-end gap-5 my-4"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3">
            <label>Admin Password</label>
            <div className="relative w-fit">
              <input
                className="input input-bordered text-base text-base-content max-w-[500px] pr-9"
                type="password"
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
          <button className="btn btn-success w-fit" type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
