import { useQuery } from "@tanstack/react-query";

async function getUserShortcuts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/shortcuts`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) {
      return {
        error: `Failed to fetch user shortcuts: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const userShortcuts = await res.json();
    return userShortcuts;
  } catch (error) {
    return {
      error: `getUserShortcuts: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useUserShortcuts() {
  return useQuery({
    queryKey: ["userShortcuts"],
    queryFn: getUserShortcuts,
  });
}
