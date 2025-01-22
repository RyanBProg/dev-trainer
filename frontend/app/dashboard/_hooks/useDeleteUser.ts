import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteUser() {
  try {
    const res = await fetch("http://localhost:4040/api/user/delete-user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      return {
        error: `Delete request failed: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      error: `deleteUser: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.clear(),
  });
}
