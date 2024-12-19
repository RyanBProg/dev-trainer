import { createShortcutTable } from "./utils/createShortcutTable";
import TableRow from "./components/TableRow";
import { fetchUserShortcuts } from "./utils/fetchUserShorctus";

export default async function Dashboard() {
  const userShortcuts = await fetchUserShortcuts();
  const shortcutsTable = createShortcutTable(userShortcuts);

  return (
    <div>
      <h1 className="font-bold text-2xl text-center pt-10 capitalize">
        Dashboard
      </h1>
      <div>
        {shortcutsTable.map((category) => {
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
