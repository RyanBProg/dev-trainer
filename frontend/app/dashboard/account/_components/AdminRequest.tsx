"use client";

import { FormEvent, useState } from "react";
import { useUserContext } from "../../_context/userContext";
import toast from "react-hot-toast";

export default function AdminRequest() {
  const [formOpen, setFormOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { setUserData } = useUserContext();

  const closeForm = () => {
    setFormOpen(false);
    setPassword("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:4040/api/auth/make-user-admin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminPassword: password }),
          credentials: "include",
        }
      );

      const userData = await res.json();
      if (userData.error) {
        throw new Error(userData.error);
      }

      setUserData((prev) => ({ ...prev, isAdmin: userData.isAdmin }));
      setFormOpen(false);
      setPassword("");
      toast.success("You are now an admin");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
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
