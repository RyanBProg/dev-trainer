import { useMutation, useQueryClient } from "@tanstack/react-query";

async function DeleteUserShortcut(shortcutId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/shortcuts/${shortcutId}`,
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
      error: `DeleteUserShortcut: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useDeleteUserShortcut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shortcutId: string) => DeleteUserShortcut(shortcutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userShortcuts"] });
    },
  });
}
