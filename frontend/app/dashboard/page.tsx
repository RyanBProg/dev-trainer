import { Suspense } from "react";
import UserShortcutTable from "./_components/UserShortcutTable";

export default function Dashboard() {
  return (
    <div className="page-frame">
      <h1 className="page-title mb-20">My Shortcuts</h1>
      <Suspense
        fallback={
          <div className="mt-44 flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }>
        <UserShortcutTable />
      </Suspense>
    </div>
  );
}
