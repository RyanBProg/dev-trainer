"use client";

import { useState } from "react";
import { TShortcut } from "@/app/_types/types";
import ShortcutsModalSelectList from "./modals/ShortcutsModalSelectList";
import ShortcutsModal from "./modals/ShortcutsModal";

type NewShortcutButtonProps = {
  type: string;
  userShortcuts: TShortcut[];
};

export default function NewShortcutButton({
  type,
  userShortcuts,
}: NewShortcutButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className="btn btn-sm" onClick={() => setIsModalOpen(true)}>
        + Add Shortcut
      </button>

      {isModalOpen && (
        <ShortcutsModal setIsModalOpen={setIsModalOpen} type={type}>
          <ShortcutsModalSelectList
            type={type}
            userShortcuts={userShortcuts}
            setIsModalOpen={setIsModalOpen}
          />
        </ShortcutsModal>
      )}
    </>
  );
}
