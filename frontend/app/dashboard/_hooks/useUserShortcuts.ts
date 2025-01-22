import { useQuery } from "@tanstack/react-query";

async function getUserShortcuts() {
  try {
    const res = await fetch("http://localhost:4040/api/user/shortcuts", {
      method: "GET",
      credentials: "include",
    });

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
