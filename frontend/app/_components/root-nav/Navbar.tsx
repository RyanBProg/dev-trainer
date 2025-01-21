"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const navMenuButtonRef = useRef<HTMLButtonElement>(null);
  const navMenuDropdownRef = useRef<HTMLUListElement>(null);

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
    <header className="navbar p-3 bg-base-300">
      <nav className="navbar-start">
        <div className="relative">
          <button
            ref={navMenuButtonRef}
            onClick={toggleNavMenu}
            className="btn btn-primary">
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
              ref={navMenuDropdownRef}
              className="absolute left-0 top-16 mt-3 menu menu-md bg-base-300 font-medium z-[1] w-60 p-2 flex flex-col gap-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <div className="flex gap-2 mt-5">
                <Link href="/login" className="btn flex-1 btn-primary">
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="btn flex-1 btn-primary btn-outline">
                  Sign Up
                </Link>
              </div>
            </ul>
          )}
        </div>
      </nav>
      <div className="navbar-end">
        <span className="text-xl font-bold pr-4">Dev Trainer</span>
      </div>
    </header>
  );
}
