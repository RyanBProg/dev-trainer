import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

async function logout() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/logout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!res.ok) {
      return {
        error: `Failed to logout user: HTTP ${res.status} ${res.statusText}`,
      };
    }
  } catch (error) {
    return {
      error: `logout: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
