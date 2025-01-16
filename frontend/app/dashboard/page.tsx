import { Suspense } from "react";
import UserShortcutTable from "./_components/UserShortcutTable";

export default function Dashboard() {
  return (
    <div className="px-8 mb-10">
      <h1 className="font-bold text-2xl text-center mt-10 mb-5 capitalize">
        My Dashboard
      </h1>
      <Suspense
        fallback={
          <div className="flex justify-center items-center mt-28">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }>
        <UserShortcutTable />
      </Suspense>
    </div>
  );
}
