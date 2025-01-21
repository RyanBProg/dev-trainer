"use client";

import { useLogout } from "@/app/_hooks/useLogout";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useUserContext } from "../../_context/userContext";

export default function AccountMenu() {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuButtonRef = useRef<HTMLButtonElement>(null);
  const accountMenuDropdownRef = useRef<HTMLUListElement>(null);
  const { logout } = useLogout();
  const { profilePicture } = useUserContext();

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
        className="btn btn-md btn-circle avatar border-none overflow-clip"
        ref={accountMenuButtonRef}
        onClick={toggleAccountMenu}>
        <Image
          src={profilePicture}
          alt="user profile icon"
          className="object-cover"
          height={100}
          width={100}
        />
      </button>
      {accountMenuOpen && (
        <ul
          className="absolute right-0 top-16 menu menu-md bg-base-300 font-medium z-[1] mt-3 w-52 p-2"
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
