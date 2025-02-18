import StudentsSidebar from '@/components/shared/StudentsSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React, { ReactNode } from 'react'

const Layout = ({children}:{children:ReactNode}) => {
  return (
    <div className="container flex p-1">
        <SidebarProvider  style={{
    "--sidebar-width": "14rem",
    "--sidebar-width-mobile": "14rem",
  } as React.CSSProperties}>
        <StudentsSidebar/>
        <div>
            {children}
        </div>
        </SidebarProvider>
    </div>
  )
}

export default Layout