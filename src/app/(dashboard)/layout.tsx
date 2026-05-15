
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useUser } from "@/firebase";
import { Sprout } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Sprout className="h-12 w-12 animate-bounce text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Syncing Ecosystem Vitals...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background selection:bg-primary selection:text-primary-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background/95 relative">
        <div className="mx-auto max-w-7xl p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
