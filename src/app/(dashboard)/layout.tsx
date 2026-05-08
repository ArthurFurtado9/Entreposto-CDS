import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-slate-50 dark:bg-zinc-950">
          <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-slate-200/80 dark:border-zinc-800 px-4 bg-white/80 backdrop-blur-md dark:bg-zinc-950/80 sticky top-0 z-10">
            <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-900" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">ERP Entreposto</span>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
