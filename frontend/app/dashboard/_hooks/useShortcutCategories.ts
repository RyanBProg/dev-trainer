import { useQuery } from "@tanstack/react-query";

async function fetchShortcutCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/shortcuts/types`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) {
      return {
        error: `Failed to fetch shortcut categories: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const userData = await res.json();
    return userData;
  } catch (error) {
    return {
      error: `fetchShortcutCategories: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useShortcutCategories() {
  return useQuery({
    queryKey: ["shortcutCategories"],
    queryFn: fetchShortcutCategories,
    enabled: false,
  });
}
