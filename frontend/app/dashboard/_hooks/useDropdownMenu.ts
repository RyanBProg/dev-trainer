import { useState, useRef, useEffect, RefObject } from "react";

type UseDropdownMenu = {
  dropdownMenuOpen: boolean;
  toggleDropdownMenu: () => void;
  menuButtonRef: RefObject<HTMLButtonElement>;
  dropdownMenuRef: RefObject<HTMLUListElement>;
};

export const useDropdownMenu = (): UseDropdownMenu => {
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLUListElement>(null);

  const toggleDropdownMenu = () => {
    setDropdownMenuOpen((prev) => !prev);
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
