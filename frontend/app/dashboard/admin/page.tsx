import AdminCheckLayer from "./_components/AdminCheckLayer";
import { Suspense } from "react";

export default function Admin() {
  return (
    <div className="px-8 container mx-auto">
      <h1 className="font-bold text-2xl text-center mt-10 mb-5 capitalize">
        Admin Panel
      </h1>
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
