"use client";

import { useState } from "react";
import { TShortcut } from "@/app/_types/types";
import ShortcutSelectModal from "./ShortcutSelectModal";

type NewShortcutButtonProps = {
  type: string;
  index: number;
  userShortcuts: TShortcut[];
};

export default function NewShortcutButton({
  type,
  index,
  userShortcuts,
}: NewShortcutButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className="btn btn-sm" onClick={() => setIsModalOpen(true)}>
        + Add Shortcut
      </button>

      {isModalOpen && (
        <div className="z-50">
          <div className="fixed inset-0 bg-white/10 backdrop-blur-sm"></div>
          <dialog id={`my_modal_${index}`} className="modal" open>
            <div className="modal-box relative bg-neutral-900">
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
              <ShortcutSelectModal
                type={type}
                userShortcuts={userShortcuts}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          </dialog>
        </div>
      )}
    </>
  );
}
