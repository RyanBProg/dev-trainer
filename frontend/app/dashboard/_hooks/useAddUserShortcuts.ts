import { useMutation, useQueryClient } from "@tanstack/react-query";

async function AddUserShortcuts(shortcutIds: string[]) {
  try {
    const res = await fetch("http://localhost:4040/api/user/shortcuts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shortcutIds }),
      credentials: "include",
    });

    if (!res.ok) {
      return {
        error: `Failed to add shortcuts: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      error: `AddUserShortcuts: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useAddUserShortcuts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shortcutIds: string[]) => AddUserShortcuts(shortcutIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userShortcuts"] });
    },
  });
}
