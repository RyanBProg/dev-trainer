import { useUserAuthContext } from "../context/userAuthContext";
import { redirect } from "next/navigation";

export function useLogout() {
  const { setAuthUser } = useUserAuthContext();

  async function logout() {
    try {
      const res = await fetch("http://localhost:4040/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAuthUser(undefined);
      redirect("/login");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }

  return { logout };
}
