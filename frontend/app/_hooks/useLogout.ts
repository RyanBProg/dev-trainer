"use client";

import { useUserAuthContext } from "../_context/userAuthContext";
import { useRouter } from "next/navigation";
import { initialUserContext } from "../_context/userAuthContext";

export function useLogout() {
  const { setAuthUser } = useUserAuthContext();
  const router = useRouter();

  async function logout() {
    try {
      const res = await fetch("http://localhost:4040/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAuthUser(initialUserContext);
      router.push("/login");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }

  return { logout };
}
