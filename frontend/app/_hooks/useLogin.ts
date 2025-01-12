"use client";

import { useUserAuthContext } from "../_context/userAuthContext";
import { useRouter } from "next/navigation";

export function useLogin() {
  const { setAuthUser } = useUserAuthContext();
  const router = useRouter();

  async function login(email: string, password: string) {
    try {
      const res = await fetch("http://localhost:4040/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const userData = await res.json();
      if (userData.error) {
        throw new Error(userData.error);
      }

      setAuthUser((prev) => ({
        ...prev,
        fullName: userData.fullName,
        isAdmin: userData.isAdmin,
      }));
      router.push("/dashboard");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }

  return { login };
}
