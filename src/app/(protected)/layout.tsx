import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { AppSidebar } from "./_components/app-sidebar"


function ProtectLayout({ children }: { children: React.ReactNode; }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}

export default ProtectLayout;