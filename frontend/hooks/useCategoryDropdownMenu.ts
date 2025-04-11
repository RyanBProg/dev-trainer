import { useState, useRef, useEffect, RefObject } from "react";
import { useShortcutCategories } from "./useShortcutCategories";

type UseCategoryDropdownMenu = {
  dropdownMenuOpen: boolean;
  toggleDropdownMenu: () => Promise<void>;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  dropdownMenuRef: RefObject<HTMLUListElement | null>;
};

export const useCategoryDropdownMenu = (): UseCategoryDropdownMenu => {
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLUListElement>(null);
  const { data, refetch } = useShortcutCategories();

  const toggleDropdownMenu = async () => {
    if (dropdownMenuOpen) {
      setDropdownMenuOpen(false);
    } else {
      if (!data) await refetch();
      setDropdownMenuOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownMenuOpen &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setDropdownMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownMenuOpen]);

  return {
    dropdownMenuOpen,
    toggleDropdownMenu,
    menuButtonRef,
    dropdownMenuRef,
  };
};
