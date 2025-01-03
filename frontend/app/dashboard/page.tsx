import { createShortcutTable } from "./utils/createShortcutTable";
import TableRow from "./components/TableRow";
import { fetchUserShortcuts } from "./utils/fetchUserShorctus";
import NewCategoryButton from "./components/NewCategoryButton";
import NewShortcutButton from "./components/NewShortcutButton";

export default async function Dashboard() {
  const userShortcuts = await fetchUserShortcuts();
  const shortcutsTable = createShortcutTable(userShortcuts);

  return (
    <div className="px-8">
      <h1 className="font-bold text-2xl text-center mt-10 mb-5 capitalize">
        Dashboard
      </h1>
      <div className="flex gap-2">
        <NewCategoryButton />
      </div>
      <div>
        {shortcutsTable.map((category) => {
          return (
            <div key={category.type}>
              <div className="flex gap-4 mt-10 mb-4">
                <h2 className="text-xl font-bold capitalize">
                  {category.type} Shortcuts
                </h2>
                <NewShortcutButton type={category.type} />
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
