"use client";

import Link from "next/link";

export default function Navbar() {
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
            className="menu menu-md dropdown-content bg-base-300 font-medium rounded-box z-[1] w-[250px] mt-3 p-4 shadow flex flex-col gap-2">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <hr className="h-[0.5px] w-full bg-base-content my-2 border-none" />
            <div className="flex gap-2">
              <li>
                <Link href="/login" className="flex-1 btn btn-outline">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="flex-1 btn btn-accent">
                  SignUp
                </Link>
              </li>
            </div>
          </ul>
        </div>
      </nav>
      <div className="navbar-end">
        <span className="text-xl font-bold pr-4">Dev Trainer</span>
      </div>
    </header>
  );
}
