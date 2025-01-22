"use client";

import { createShortcutTable } from "../_utils/createShortcutTable";
import TableRow from "./TableRow";
import NewShortcutButton from "./NewShortcutButton";
import NewCategoryButton from "./NewCategoryButton";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import { useUserShortcuts } from "../_hooks/useUserShortcuts";

export default function UserShortcutTable() {
  const router = useRouter();
  const {
    data: userShortcuts,
    isError: userShortcutsError,
    isLoading: userShortcutsLoading,
    isFetching: userShortcutsFetching,
  } = useUserShortcuts();

  if (userShortcutsError || (userShortcuts && userShortcuts.error)) {
    router.push("/login");
    return null;
  }

  if (userShortcutsLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const shortcutsTable = createShortcutTable(userShortcuts);

  return (
    <div>
      <div className="flex gap-2">
        <NewCategoryButton userShortcuts={userShortcuts} />
      </div>
      <div className="grid gap-16">
        {shortcutsTable
          .sort((a, b) => a.type.localeCompare(b.type))
          .map((category) => {
            return (
              <div key={category.type} className="overflow-x-scroll">
                <div className="flex flex-wrap gap-5 mb-5">
                  <h2 className="text-xl font-bold capitalize">
                    {category.type} Shortcuts
                  </h2>
                  <NewShortcutButton
                    type={category.type}
                    userShortcuts={category.shortcuts}
                  />
                  {userShortcutsFetching && <LoadingSpinner size="sm" />}
                </div>
                <div className="pb-5 overflow-x-scroll">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="bg-base-200">
                        <th>Name</th>
                        <th>Description</th>
                        <th>Keys</th>
                        <th className="w-6"></th>
                      </tr>
                    </thead>
                    <tbody
                      className={`transition-opacity duration-200 ${
                        userShortcutsFetching ? "opacity-50" : "opacity-100"
                      }`}>
                      {category.shortcuts
                        .sort((a, b) =>
                          a.shortDescription.localeCompare(b.shortDescription)
                        )
                        .map((shortcut) => {
                          return (
                            <TableRow key={shortcut._id} shortcut={shortcut} />
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
