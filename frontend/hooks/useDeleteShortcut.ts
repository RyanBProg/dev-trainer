import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteShortcut(shortcutId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/shortcuts/admin/${shortcutId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      return {
        error: `Failed to delete shortcut: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      error: `deleteShortcut: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useDeleteShortcut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shortcutId: string) => deleteShortcut(shortcutId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shortcutsOfType", "shortcutCategories"],
      });
    },
  });
}
