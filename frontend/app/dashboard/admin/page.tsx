import AdminCheckLayer from "./_components/AdminCheckLayer";
import { Suspense } from "react";

export default function Admin() {
  return (
    <div className="page-frame container mx-auto">
      <h1 className="page-title mb-10">Admin Panel</h1>
      <Suspense
        fallback={
          <div className="mt-44 flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }>
        <AdminCheckLayer />
      </Suspense>
    </div>
  );
}
