"use client";

import { useLogout } from "@/app/_hooks/useLogout";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useUserContext } from "../../_context/userContext";
import { useQuery } from "@tanstack/react-query";
import { getUserProfilePicture } from "../../_requests/getUserProfilePicture";
import defaultProfilePicture from "@/app/_assets/icons/user.png";
import LoadingSpinner from "../LoadingSpinner";

export default function AccountMenu() {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuButtonRef = useRef<HTMLButtonElement>(null);
  const accountMenuDropdownRef = useRef<HTMLUListElement>(null);
  const { logout } = useLogout();
  const { profilePicture } = useUserContext();
  const { data, isLoading } = useQuery({
    queryKey: ["profilePicture"],
    queryFn: getUserProfilePicture,
  });

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
    <div className="flex items-center justify-center">
      <button
        className="btn btn-md btn-circle border-none overflow-clip"
        ref={accountMenuButtonRef}
        onClick={toggleAccountMenu}>
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <Image
            src={data?.userPicture || defaultProfilePicture}
            alt="user profile icon"
            className="object-cover"
            height={48}
            width={48}
          />
        )}
      </button>
      {accountMenuOpen && (
        <ul
          className="absolute right-3 -bottom-3 translate-y-full menu menu-md bg-base-300 font-medium z-[1] w-52 p-2"
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
