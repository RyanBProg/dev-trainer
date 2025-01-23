"use client";

import { TUserSignup } from "../_types/types";
import { useRouter } from "next/navigation";

export function signupRequest() {
  const router = useRouter();

  async function signup(signupData: TUserSignup) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: signupData.fullName,
            email: signupData.email,
            password: signupData.password,
            confirmPassword: signupData.confirmPassword,
          }),
          credentials: "include",
        }
      );

      const userData = await res.json();
      if (userData.error) {
        throw new Error(userData.error);
      }

      router.push("/dashboard");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }
  return { signup };
}
