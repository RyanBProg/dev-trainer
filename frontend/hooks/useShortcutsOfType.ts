import { useQuery } from "@tanstack/react-query";

type PaginationParams = {
  page?: number;
  limit?: number;
};

async function getShortcutsOfType(
  type: string,
  { page = 1, limit = 15 }: PaginationParams
) {
  try {
    const encodedType = encodeURIComponent(type);
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/shortcuts/type/${encodedType}?${queryParams}`,
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

export function useShortcutsOfType(
  type: string,
  pagination: PaginationParams = {}
) {
  return useQuery({
    queryKey: ["shortcutsOfType", type, pagination],
    queryFn: () => getShortcutsOfType(type, pagination),
    enabled: !!type,
  });
}
