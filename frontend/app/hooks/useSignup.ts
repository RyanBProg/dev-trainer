import { useUserAuthContext } from "../context/userAuthContext";
import { redirect } from "next/navigation";
import { TUserSignup } from "../types/types";

export function useLogin() {
  const { setAuthUser } = useUserAuthContext();

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
      redirect("/");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }
  return { signup };
}
