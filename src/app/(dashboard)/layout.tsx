import React from "react";
import { TopNavbar } from "@/components/top-navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#fdfbf8] dark:bg-zinc-900 text-[#404040] dark:text-slate-100 flex flex-col transition-colors">
        
        {/* Horizontal Sticky Header Navigation */}
        <TopNavbar user={user} />
        
        {/* Central Workspace Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
        
      </div>
    </TooltipProvider>
  );
}
