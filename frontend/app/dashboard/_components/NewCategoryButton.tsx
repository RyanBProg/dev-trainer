"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TShortcut } from "@/app/_types/types";
import ShortcutSelectModal from "./ShortcutSelectModal";

type NewCategoryButtonProps = {
  userShortcuts: TShortcut[];
};

export default function NewCategoryButton({
  userShortcuts,
}: NewCategoryButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState("");
  const router = useRouter();

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:4040/api/shortcuts/types", {
      method: "GET",
      credentials: "include",
    });

    const categories = await res.json();
    if (categories.error) router.push("/login");
    setCategories(categories);
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
      fetchCategories();
    } else {
      setIsDropdownOpen(false);
    }
  };

  const openModal = (category: string) => {
    setIsDropdownOpen(false);
    setType(category);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="dropdown dropdown-bottom">
        <div
          tabIndex={0}
          onClick={toggleDropdown}
          role="button"
          className="btn m-1">
          + Add New Category
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow">
          {categories.length === 0 ? (
            <div className="flex justify-center items-center py-2">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            categories.map((category) => (
              <li key={category}>
                <button onClick={() => openModal(category)}>{category}</button>
              </li>
            ))
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div className="z-50">
          <div className="fixed inset-0 bg-white/10 backdrop-blur-sm"></div>
          <dialog id={`my_modal_dropdown`} className="modal" open>
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
