"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewShortcutButton({ type }: { type: string }) {
  const [shortcuts, setShortcuts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const encodedType = encodeURIComponent(type);
    const fetchShorcuts = async () => {
      const res = await fetch(
        `http://localhost:4040/api/shortcuts/type/${encodedType}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const shortcuts = await res.json();
      if (shortcuts.error) router.push("/login");
      console.log(shortcuts);
      setShortcuts(shortcuts);
    };

    fetchShorcuts();
  }, []);

  if (shortcuts.length === 0) return <>Loading...</>;

  return (
    <>
      <button
        className="btn btn-sm"
        onClick={() => document.getElementById("my_modal_2").showModal()}>
        + Add Shortcut
      </button>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">Shortcuts</h3>
          <ul className="grid gap-2">
            {shortcuts.length === 0 ? (
              <>Loading...</>
            ) : (
              shortcuts.map((shortcut, index) => (
                <li
                  key={shortcut.shortDescription}
                  className="capitalize flex gap-2">
                  <button className="btn btn-xs btn-success">+</button>
                  {shortcut.shortDescription}
                </li>
              ))
            )}
          </ul>
        </div>
      </dialog>
    </>
  );
}
