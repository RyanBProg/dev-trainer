import EditShortcut from "@/app/dashboard/admin/_components/EditShortcut";
import CreateShortcutForm from "@/app/dashboard/admin/_components/CreateShortcutForm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminCheckLayer() {
  const cookieStore = await cookies();

  const res = await fetch("http://localhost:4040/api/user", {
    method: "GET",
    headers: { Cookie: cookieStore.toString() },
  });

  const resData = await res.json();
  if (resData.error) redirect("/dashboard");
  if (!resData.isAdmin) redirect("/dashboard");

  return (
    <>
      <h2 className="mb-4 font-semibold text-lg">Create a Shortcut</h2>
      <CreateShortcutForm />
      <hr className="mt-10 border-primary-content" />
      <EditShortcut />
    </>
  );
}
