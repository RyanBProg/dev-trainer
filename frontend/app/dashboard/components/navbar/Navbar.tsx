"use client";

import { useLogout } from "@/app/hooks/useLogout";
import Link from "next/link";

export default function Navbar() {
  const { logout } = useLogout();

  return (
    <header className="navbar bg-base-100">
      <nav className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
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
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/guides">Guides</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="navbar-center">
        <span className="text-xl font-bold">Dev Trainer</span>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <Link href="/dashboard" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard">Settings</Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}