import { useQuery } from "@tanstack/react-query";

async function getShortcutsOfType(type: string) {
  try {
    const encodedType = encodeURIComponent(type);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/shortcuts/type/${encodedType}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) {
      return {
        error: `Failed to fetch shortcuts: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      error: `getShortcutsOfType: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useShortcutsOfType(type: string) {
  return useQuery({
    queryKey: ["shortcutsOfType", type],
    queryFn: () => getShortcutsOfType(type),
    enabled: !!type,
  });
}
