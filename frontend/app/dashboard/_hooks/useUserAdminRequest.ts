import { useMutation, useQueryClient } from "@tanstack/react-query";

async function userAdminRequest(password: string) {
  try {
    const res = await fetch("http://localhost:4040/api/auth/make-user-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminPassword: password }),
      credentials: "include",
    });

    if (!res.ok) {
      return {
        error: `Admin request failed: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      error: `userAdminRequest: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useUserAdminRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (password: string) => userAdminRequest(password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
}
