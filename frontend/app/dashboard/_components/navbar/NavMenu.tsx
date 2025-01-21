"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../_context/userContext";

export default function NavMenu() {
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const navMenuButtonRef = useRef<HTMLButtonElement>(null);
  const navMenuDropdownRef = useRef<HTMLUListElement>(null);
  const { userData } = useUserContext();

  const toggleNavMenu = () => {
    if (navMenuOpen) {
      setNavMenuOpen(false);
    } else {
      setNavMenuOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // check if the click is outside the menu dropdown and not the menu button
      if (
        navMenuOpen &&
        navMenuDropdownRef.current &&
        !navMenuDropdownRef.current.contains(event.target as Node) &&
        navMenuButtonRef.current &&
        !navMenuButtonRef.current.contains(event.target as Node)
      ) {
        setNavMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navMenuOpen]);

  return (
    <div className="relative">
      <button
        className="btn btn-primary btn-circle"
        ref={navMenuButtonRef}
        onClick={toggleNavMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>

      {navMenuOpen && (
        <ul
          className="absolute left-0 top-16 menu menu-md bg-base-300 font-medium z-[1] mt-3 w-52 p-2"
          ref={navMenuDropdownRef}>
          <li>
            <Link href="/dashboard" onClick={toggleNavMenu}>
              Dashboard
            </Link>
          </li>
          {userData.isAdmin && (
            <li>
              <Link href="/dashboard/admin" onClick={toggleNavMenu}>
                Admin Panel
                <span className="badge badge-info">New</span>
              </Link>
            </li>
          )}
          <li>
            <Link href="/dashboard/code-snippets" onClick={toggleNavMenu}>
              Code Snippets
            </Link>
          </li>
          <li>
            <Link href="/dashboard/guides" onClick={toggleNavMenu}>
              Guides
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
