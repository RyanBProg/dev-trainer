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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "User update failed");
    }

    return data;
  } catch (error) {
    throw error;
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
