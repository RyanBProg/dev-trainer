import { useMutation, useQueryClient } from "@tanstack/react-query";

async function AddUserProfilePicture(formData: FormData) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/profile-picture`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    if (!res.ok) {
      return {
        error: `Failed to add profile picture: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      error: `AddUserProfilePicture: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useAddUserProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => AddUserProfilePicture(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profilePicture"] });
    },
  });
}
