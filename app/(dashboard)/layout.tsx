import DynamicSidebars from '@/components/shared/DynamicSidebars'
import PrivateSection from '@/components/shared/PrivateSection'
import TopBar from '@/components/shared/TopBar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { BellRingIcon } from 'lucide-react'
import React, { ReactNode } from 'react'

const Layout = ({children}:{children:ReactNode}) => {
  
  return (
      <PrivateSection>
    <SidebarProvider>
      <DynamicSidebars/>
        <SidebarInset>
          <main className='w-full h-full p-3 bg-slate-200 rounded-[10px]'>

            {/* Top bar */}
            <TopBar/>
            <div className='h-[95%] overflow-y-none'>
            {children}
            </div>
          </main>
        </SidebarInset>
    </SidebarProvider>
    </PrivateSection>
  )
}

export default Layout