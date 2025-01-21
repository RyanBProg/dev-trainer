"use client";

import { Dispatch, ReactNode, SetStateAction } from "react";

type ShortcutsModalProps = {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  type: string;
};

export default function ShortcutsModal({
  setIsModalOpen,
  children,
  type,
}: ShortcutsModalProps) {
  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm z-10"></div>
      <dialog className="modal" open>
        <div className="modal-box relative bg-neutral-900">
          <button
            type="button"
            className="btn btn-sm btn-error absolute right-2 top-2"
            onClick={() => setIsModalOpen(false)}>
            ✕
          </button>
          <div>
            <h3 className="font-bold text-lg mb-10 capitalize">
              {type} Shortcuts
            </h3>
            {children}
          </div>
        </div>
      </dialog>
    </>
  );
}
