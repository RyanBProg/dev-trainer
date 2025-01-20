"use client";

import { FormEvent, useState } from "react";
import { useUserContext } from "../../_context/userContext";

export default function AdminRequest() {
  const [formOpen, setFormOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { setUserData } = useUserContext();

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
      alert("You are now an admin");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  return (
    <div className="grid gap-2">
      <span className="font-semibold">Requesting Admin Rights</span>
      <button
        className="btn btn-outline w-fit"
        onClick={() => setFormOpen((prev) => !prev)}>
        Admin Request
      </button>
      {formOpen && (
        <form className="flex items-end gap-5 my-4" onSubmit={handleSubmit}>
          <div className="grid gap-3">
            <label>Admin Password</label>
            <div className="relative">
              <input
                className="input text-lg input-bordered max-w-[400px]"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute -top-3 -right-3 btn btn-error btn-circle btn-xs"
                onClick={() => setFormOpen(false)}>
                X
              </button>
            </div>
          </div>
          <button className="btn" type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
