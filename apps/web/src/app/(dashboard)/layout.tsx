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
    <div className="relative min-h-screen flex flex-col bg-[#060b14] overflow-hidden">
      {/* Ambient background orbs — fixed decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Top-left blue orb */}
        <div className="absolute -top-40 -left-32 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[100px] animate-[orb-pulse_10s_ease-in-out_infinite]" />
        {/* Top-right indigo orb */}
        <div className="absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-indigo-600/8 blur-[90px] animate-[orb-pulse_13s_ease-in-out_infinite_reverse]" />
        {/* Bottom-center blue orb */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-sky-600/6 blur-[100px] animate-[orb-pulse_15s_ease-in-out_infinite]" />
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex mx-auto w-full max-w-7xl">
          <SidebarNav />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-w-0 overflow-y-auto">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
