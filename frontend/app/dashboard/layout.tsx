"use client";

import Footer from "./_components/navbar/Footer";
import Navbar from "./_components/navbar/Navbar";
import ReactQueryProvider from "./_react-query/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ReactQueryProvider>
  );
}
