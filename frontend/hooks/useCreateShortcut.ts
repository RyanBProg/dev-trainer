import { TShortcutForm } from "@/utils/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createShortcut(formData: TShortcutForm) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/shortcuts/admin`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      }
    );

    if (!res.ok) {
      return {
        error: `Failed to create shortcut: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      error: `createShortcut: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useCreateShortcut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: TShortcutForm) => createShortcut(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shortcutsOfType", "shortcutCategories"],
      });
    },
  });
}
