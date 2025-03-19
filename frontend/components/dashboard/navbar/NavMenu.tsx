"use client";

import Link from "next/link";
import { useUserData } from "@/hooks/useUserData";
import { useDropdownMenu } from "@/hooks/useDropdownMenu";
import LoadingSpinner from "../LoadingSpinner";

export default function NavMenu() {
  const {
    menuButtonRef,
    dropdownMenuOpen,
    dropdownMenuRef,
    toggleDropdownMenu,
  } = useDropdownMenu();
  const { data, isLoading } = useUserData();

  return (
    <nav className="h-min">
      <button
        className="btn btn-md btn-square btn-primary"
        ref={menuButtonRef}
        onClick={toggleDropdownMenu}>
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
      {dropdownMenuOpen && (
        <ul
          className="absolute left-3 -bottom-3 translate-y-full menu menu-md bg-base-300 font-medium z-[1] w-52 p-2"
          ref={dropdownMenuRef}>
          {isLoading ? (
            <LoadingSpinner size={"sm"} />
          ) : (
            <>
              <li>
                <Link href="/dashboard" onClick={toggleDropdownMenu}>
                  Dashboard
                </Link>
              </li>
              {data.isAdmin && (
                <li>
                  <Link href="/dashboard/admin" onClick={toggleDropdownMenu}>
                    Admin Panel
                    <span className="badge badge-info">New</span>
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/dashboard/code-snippets"
                  onClick={toggleDropdownMenu}>
                  Code Snippets
                </Link>
              </li>
              <li>
                <Link href="/dashboard/guides" onClick={toggleDropdownMenu}>
                  Guides
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}
