"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Optional: check session exists via fetch here
    router.replace("/dashboard");
  }, []);

  return <p>Signing you in...</p>;
}
