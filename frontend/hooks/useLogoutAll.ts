import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

async function logoutAll() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/logout-all`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!res.ok) {
      return {
        error: `Failed to logoutAll user: HTTP ${res.status} ${res.statusText}`,
      };
    }
  } catch (error) {
    return {
      error: `logoutAll: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useLogoutAll() {
  const router = useRouter();

  return useMutation({
    mutationFn: logoutAll,
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
