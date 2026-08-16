import React from "react";
import { Navbar } from "@/components/layouts/navbar";
import { SidebarNav } from "@/components/layouts/sidebar-nav";
import { BottomNav } from "@/components/layouts/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 flex mx-auto w-full max-w-7xl">
        <SidebarNav />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
