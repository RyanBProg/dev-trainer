import UserShortcutTable from "./_components/UserShortcutTable";

export default function Dashboard() {
  return (
    <div className="page-frame">
      <h1 className="page-title mb-20">My Shortcuts</h1>
      <UserShortcutTable />
    </div>
  );
}
