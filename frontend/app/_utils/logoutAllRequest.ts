"use client";

import { useRouter } from "next/navigation";

export function logoutAllRequest() {
  const router = useRouter();

  async function logoutAll() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/logout-all`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      router.push("/login");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }

  return { logoutAll };
}
