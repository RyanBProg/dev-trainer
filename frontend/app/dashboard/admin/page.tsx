import EditShortcut from "./_components/EditShortcut";
import CreateShortcutForm from "./_components/CreateShortcutForm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Admin() {
  const cookieStore = await cookies();

  const res = await fetch("http://localhost:4040/api/user", {
    method: "GET",
    headers: { Cookie: cookieStore.toString() },
  });

  const resData = await res.json();
  if (resData.error) redirect("/dashboard");
  if (!resData.isAdmin) redirect("/dashboard");

  return (
    <div className="px-8 container mx-auto">
      <h1 className="font-bold text-2xl text-center mt-10 mb-5 capitalize">
        Admin Panel
      </h1>
      <h2 className="mb-4 font-semibold text-lg">Create a Shortcut</h2>
      <CreateShortcutForm />

      <hr className="mt-10 border-neutral-600" />

      <EditShortcut />
    </div>
  );
}
