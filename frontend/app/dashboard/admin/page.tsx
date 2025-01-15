import EditShortcut from "./_components/EditShortcut";
import CreateShortcutForm from "./_components/CreateShortcutForm";

export default function Admin() {
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
