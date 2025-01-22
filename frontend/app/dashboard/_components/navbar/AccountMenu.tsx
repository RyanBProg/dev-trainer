"use client";

import { logoutRequest } from "@/app/_utils/logoutRequest";
import Link from "next/link";
import Image from "next/image";
import defaultProfilePicture from "@/app/_assets/icons/user.png";
import LoadingSpinner from "../LoadingSpinner";
import { useUserProfilePicture } from "../../_hooks/useUserProfilePicture";
import { useDropdownMenu } from "../../_hooks/useDropdownMenu";

export default function AccountMenu() {
  const { logout } = logoutRequest();
  const { data, isLoading, isFetching } = useUserProfilePicture();
  const {
    menuButtonRef,
    dropdownMenuOpen,
    dropdownMenuRef,
    toggleDropdownMenu,
  } = useDropdownMenu();

  return (
    <div className="flex items-center justify-center">
      <button
        className="btn btn-md btn-circle border-none overflow-clip"
        ref={menuButtonRef}
        onClick={toggleDropdownMenu}>
        {isLoading || isFetching ? (
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
      {dropdownMenuOpen && (
        <ul
          className="absolute right-3 -bottom-3 translate-y-full menu menu-md bg-base-300 font-medium z-[1] w-52 p-2"
          ref={dropdownMenuRef}>
          <li>
            <Link
              href="/dashboard/account"
              className="justify-between"
              onClick={toggleDropdownMenu}>
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
