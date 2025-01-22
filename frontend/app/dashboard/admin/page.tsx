"use client";

import { useRouter } from "next/navigation";
import LoadingSpinner from "../_components/LoadingSpinner";
import { useUserData } from "../_hooks/useUserData";
import CreateShortcutForm from "./_components/CreateShortcutForm";
import EditShortcut from "./_components/EditShortcut";

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
