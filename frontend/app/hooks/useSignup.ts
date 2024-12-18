"use client";

import { useUserAuthContext } from "../context/userAuthContext";
import { TUserSignup } from "../types/types";
import { useRouter } from "next/navigation";

export function useSignup() {
  const { setAuthUser } = useUserAuthContext();
  const router = useRouter();

  async function signup(signupData: TUserSignup) {
    try {
      const res = await fetch("http://localhost:4040/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: signupData.fullName,
          email: signupData.email,
          password: signupData.password,
          confirmPassword: signupData.confirmPassword,
        }),
        credentials: "include",
      });

      const userData = await res.json();
      if (userData.error) {
        throw new Error(userData.error);
      }

      setAuthUser({
        fullName: userData.fullName,
        email: userData.email,
        custom: userData.custom,
      });
      router.push("/dashboard");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }
  return { signup };
}
