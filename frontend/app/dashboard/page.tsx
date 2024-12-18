"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserData } from "../hooks/fetchUserData";
import { demoData } from "./demoData";
import { createShortcutTable } from "./utils/createShortcutTable";
import TableRow from "./components/TableRow";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetchUserData();
      if (!userData) {
        router.push(`/login`);
        return;
      }
      setFullName(userData.fullName);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <span className="font-bold text-2xl block text-center mx-auto mt-20">
        <span className="loading loading-spinner mr-3"></span>loading...
      </span>
    );
  }

  const userShortcuts = createShortcutTable(demoData);

  return (
    <div>
      <h1 className="font-bold text-2xl text-center pt-10 capitalize">
        Welcome {fullName}
      </h1>
      <div>
        {userShortcuts.map((category) => {
          return (
            <div key={category.type}>
              <h2 className="text-xl font-bold pt-10 pb-4 px-4 capitalize">
                {category.type} Shortcuts
              </h2>
              <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Keys</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.shortcuts.map((shortcut) => {
                      return <TableRow key={shortcut.id} shortcut={shortcut} />;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
