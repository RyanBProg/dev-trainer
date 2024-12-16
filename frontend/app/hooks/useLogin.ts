import { useUserAuthContext } from "../context/userAuthContext";
import { redirect } from "next/navigation";

export function useLogin() {
  const { setAuthUser } = useUserAuthContext();

  async function login(email: string, password: string) {
    try {
      const res = await fetch("http://localhost:4040/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

  return { login };
}
