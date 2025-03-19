import PrivateSection from '@/components/shared/PrivateSection'
import StudentsSidebar from '@/components/shared/StudentsSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React, { ReactNode } from 'react'

const Layout = ({children}:{children:ReactNode}) => {
  return (
    <div className="container flex p-1">
      <PrivateSection>
            {children}
    </PrivateSection>
    </div>
  )
}

export default Layout