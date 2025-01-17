"use client";

import { useLogout } from "@/app/_hooks/useLogout";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function AccountMenu() {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuButtonRef = useRef<HTMLButtonElement>(null);
  const accountMenuDropdownRef = useRef<HTMLUListElement>(null);
  const { logout } = useLogout();

  const toggleAccountMenu = () => {
    if (accountMenuOpen) {
      setAccountMenuOpen(false);
    } else {
      setAccountMenuOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // check if the click is outside the menu dropdown and not the menu button
      if (
        accountMenuOpen &&
        accountMenuDropdownRef.current &&
        !accountMenuDropdownRef.current.contains(event.target as Node) &&
        accountMenuButtonRef.current &&
        !accountMenuButtonRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountMenuOpen]);

  return (
    <div className="relative">
      <button
        className="btn btn-ghost btn-circle avatar"
        ref={accountMenuButtonRef}
        onClick={toggleAccountMenu}>
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
        </div>
      </button>
      {accountMenuOpen && (
        <ul
          className="absolute right-0 menu menu-md bg-base-300 font-medium rounded-box z-[1] mt-3 w-52 p-2 shadow"
          ref={accountMenuDropdownRef}>
          <li>
            <Link
              href="/dashboard/account"
              className="justify-between"
              onClick={toggleAccountMenu}>
              Account
            </Link>
          </li>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      )}
    </div>
  );
}
