import { createShortcutTable } from "../_utils/createShortcutTable";
import TableRow from "./TableRow";
import NewShortcutButton from "./NewShortcutButton";
import NewCategoryButton from "./NewCategoryButton";
import { fetchUserShortcuts } from "@/app/dashboard/_utils/fetchUserShorctus";

export default async function UserShortcutTable() {
  const userShortcuts = await fetchUserShortcuts();
  const shortcutsTable = createShortcutTable(userShortcuts);

  return (
    <div>
      <div className="flex gap-2">
        <NewCategoryButton userShortcuts={userShortcuts} />
      </div>
      <div>
        {shortcutsTable.map((category, index) => {
          return (
            <div key={category.type}>
              <div className="flex gap-4 mt-10 mb-4">
                <h2 className="text-xl font-bold capitalize">
                  {category.type} Shortcuts
                </h2>
                <NewShortcutButton
                  type={category.type}
                  index={index}
                  userShortcuts={category.shortcuts}
                />
              </div>
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
