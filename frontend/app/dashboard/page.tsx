"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserData } from "../hooks/fetchUserData";
import ShortcutKey from "./components/ShortcutKey";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetchUserData();
      if (!userData) router.push(`/login`);
      setFullName(userData.fullName);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <p>loading</p>;
  }

  const demoData = {
    shortcuts: [
      {
        shortDescription: "paste",
        description: "paste something",
        keys: ["cmd", "v"],
        type: "mac",
      },
      {
        shortDescription: "copy",
        description: "copy something",
        keys: ["cmd", "c"],
        type: "mac",
      },
      {
        shortDescription: "close file tree",
        description: "close the vs code file tree",
        keys: ["cmd", "b"],
        type: "vs code",
      },
    ],
  };

  function createTable(demoData) {
    const tableHeadings = new Set();

    demoData.shortcuts.forEach((shortcut) => {
      tableHeadings.add(shortcut.type);
    });

    const table = [];

    tableHeadings.forEach((heading) => {
      const typeTable = { type: heading, shortcuts: [] };
      demoData.shortcuts.forEach((shortcut) => {
        if (shortcut.type === heading) typeTable.shortcuts.push(shortcut);
      });
      table.push(typeTable);
    });

    return table;
  }

  const userShortcuts = createTable(demoData);

  return (
    <div>
      <h1 className="font-bold text-4xl text-center pt-10">
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
                      return (
                        <tr key={shortcut.shortDescription}>
                          <td className="capitalize font-semibold">
                            {shortcut.shortDescription}
                          </td>
                          <td>{shortcut.description}</td>
                          <td className="flex gap-4 font-semibold">
                            {shortcut.keys.map((key) => (
                              <ShortcutKey key={key} value={key} />
                            ))}
                          </td>
                          <td>
                            <button className="btn btn-square btn-xs mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                            </button>
                            <button className="btn btn-square btn-xs mr-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                            <button className="btn btn-square btn-xs bg-red-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
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
