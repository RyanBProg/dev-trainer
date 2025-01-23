import { TShortcutForm } from "@/app/_types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateShortcut(formData: TShortcutForm, shortcutId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/shortcuts/admin/${shortcutId}`,
      {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      }
    );

    if (!res.ok) {
      return {
        error: `Failed to update shortcut: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      error: `updateShortcut: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useUpdateShortcut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      formData,
      shortcutId,
    }: {
      formData: TShortcutForm;
      shortcutId: string;
    }) => updateShortcut(formData, shortcutId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shortcutsOfType", "shortcutCategories"],
      });
    },
  });
}
