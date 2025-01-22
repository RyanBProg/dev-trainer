import { useQuery } from "@tanstack/react-query";

async function getUserProfilePicture() {
  try {
    const res = await fetch("http://localhost:4040/api/user/profile-picture", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return {
        error: `Failed to fetch profile picture: HTTP ${res.status} ${res.statusText}`,
      };
    }

    const profileData = await res.json();
    return { userPicture: profileData.profilePicture };
  } catch (error) {
    return {
      error: `getUserProfilePicture: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function useUserProfilePicture() {
  return useQuery({
    queryKey: ["profilePicture"],
    queryFn: getUserProfilePicture,
    staleTime: Infinity,
  });
}
