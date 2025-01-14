"use client";

import CreateShortcutForm from "./_components/CreateShortcutForm";

export default function Admin() {
  return (
    <div className="px-8 container mx-auto">
      <h1 className="font-bold text-2xl text-center mt-10 mb-5 capitalize">
        Admin Panel
      </h1>
      <CreateShortcutForm />
    </div>
  );
}
