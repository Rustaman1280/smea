import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";

export const metadata: Metadata = {
  title: "Superapp SMKN 1 Garut - Platform Terpadu Sekolah Kejuruan",
  description:
    "Platform terpadu akademik, administrasi, presensi digital, kantin, inventaris, dan kehidupan sekolah SMKN 1 Garut.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-sky-100 selection:text-sky-900">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
