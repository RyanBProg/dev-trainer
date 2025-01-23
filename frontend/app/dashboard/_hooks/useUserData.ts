import { useQuery } from "@tanstack/react-query";

async function getUserData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) {
      return {
        error: `Failed to fetch user data: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const userData = await res.json();
    return userData;
  } catch (error) {
    return {
      error: `getUserData: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useUserData() {
  return useQuery({
    queryKey: ["userData"],
    queryFn: getUserData,
    staleTime: Infinity,
  });
}
