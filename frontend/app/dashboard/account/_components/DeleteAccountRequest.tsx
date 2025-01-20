"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function DeleteAccountRequest({ email }: { email: string }) {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteString, setDeleteString] = useState("");
  const router = useRouter();

  const deletePassword = `delete-${email}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (deleteString !== deletePassword) {
      alert("Delete string must match");
      return;
    }

    try {
      const res = await fetch("http://localhost:4040/api/user/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      router.push("/login");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
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
        <form className="flex items-end gap-5 my-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 relative">
            <label>
              Please type<span className="font-bold"> {deletePassword} </span>
              to delete your account
            </label>
            <div className="relative">
              <input
                className="input text-lg input-primary w-full"
                type="text"
                required
                value={deleteString}
                onChange={(e) => setDeleteString(e.target.value)}
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
