"use client";

import { useUserAuthContext } from "./context/userAuthContext";
import { redirect } from "next/navigation";

export default function Home() {
  const { authUser } = useUserAuthContext();
  if (!authUser) redirect(`/login`);
  return <h1>Home Page</h1>;
}
