"use client";

import { useLogout } from "@/app/_hooks/useLogout";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import defaultProfileIcon from "@/app/_assets/icons/user.png";

export default function AccountMenu() {
  const [isLoading, setIsLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
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

  // Fetch user's profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await fetch(
          "http://localhost:4040/api/user/profile-picture",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile picture");
        }

        const data = await response.json();
        if (data.profilePicture) {
          setProfilePicture(data.profilePicture);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setProfilePicture(null);
        setIsLoading(false);
      }
    };

    fetchProfilePicture();
  }, []);

  return (
    <div className="relative">
      <button
        className="btn btn-circle avatar border-none overflow-clip"
        ref={accountMenuButtonRef}
        onClick={toggleAccountMenu}>
        {isLoading ? (
          <div className="flex justify-center items-center py-2">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <Image
            src={profilePicture || defaultProfileIcon}
            alt="user profile icon"
            height={40}
            width={40}
          />
        )}
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
