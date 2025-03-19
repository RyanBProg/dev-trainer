"use client";

import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { useUserData } from "@/hooks/useUserData";
import CreateShortcutForm from "@/components/dashboard/admin/CreateShortcutForm";
import EditShortcut from "@/components/dashboard/admin/EditShortcut";

export default function Admin() {
  const router = useRouter();
  const { data, isLoading } = useUserData();

  if (!isLoading && !data?.isAdmin) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="page-frame container mx-auto">
      <h1 className="page-title mb-10">Admin Panel</h1>
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <>
          <h2 className="mb-4 font-semibold text-lg">Create a Shortcut</h2>
          <CreateShortcutForm />
          <hr className="mt-10 border-primary-content" />
          <EditShortcut />
        </>
      )}
    </div>
  );
}
