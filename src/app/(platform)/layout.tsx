import { cookies } from "next/headers"
import { AppSidebar } from "@/components/appsidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import  { ReactNode } from 'react'

const Layout = async ({children}:{children:ReactNode}) => {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

 return (
<SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
      <main className="p-2">
        <SidebarTrigger />
        {children}
      </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout