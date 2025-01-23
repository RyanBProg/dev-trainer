"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useUserAdminRequest } from "../../_hooks/useUserAdminRequest";

export default function AdminRequest() {
  const [formOpen, setFormOpen] = useState(false);
  const [password, setPassword] = useState("");
  const adminRequestMutation = useUserAdminRequest();

  const closeForm = () => {
    setFormOpen(false);
    setPassword("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await adminRequestMutation.mutateAsync(password);
      if (res.error) {
        toast.error("Admin password incorrect");
        return;
      }
      setFormOpen(false);
      setPassword("");
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
          onSubmit={handleSubmit}>
          <div className="grid gap-3">
            <label>Admin Password</label>
            <div className="relative w-fit">
              <input
                className="input input-bordered text-base text-base-content max-w-[500px] pr-9"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
