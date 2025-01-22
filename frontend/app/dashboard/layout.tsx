"use client";

import Footer from "./_components/footer/Footer";
import Navbar from "./_components/navbar/Navbar";
import { UserContextProvider } from "@/app/dashboard/_context/userContext";
import ReactQueryProvider from "./_react-query/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <UserContextProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </UserContextProvider>
    </ReactQueryProvider>
  );
}
