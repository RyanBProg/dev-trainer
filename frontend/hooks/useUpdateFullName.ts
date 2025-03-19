import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateFullName(fullName: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/full-name`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
        credentials: "include",
      }
    );

    if (!res.ok) {
      return {
        error: `Failed to add shortcuts: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      error: `updateFullName: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useUpdateFullName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fullName: string) => updateFullName(fullName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
}
