import DynamicSidebars from '@/components/shared/DynamicSidebars'
import PrivateSection from '@/components/shared/PrivateSection'
import { SidebarProvider } from '@/components/ui/sidebar'
import React, { ReactNode } from 'react'

const Layout = ({children}:{children:ReactNode}) => {
  return (
    <SidebarProvider>
    <div className="container flex p-1">
      <DynamicSidebars/>
      <PrivateSection>
            {children}
    </PrivateSection>
    </div>
    </SidebarProvider>
  )
}

export default Layout