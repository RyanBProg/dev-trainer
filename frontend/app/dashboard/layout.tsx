"use client";

import Footer from "@/components/dashboard/navbar/Footer";
import Navbar from "@/components/dashboard/navbar/Navbar";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex min-w-screen">{children}</main>
        <Footer />
      </div>
    </ReactQueryProvider>
  );
}
