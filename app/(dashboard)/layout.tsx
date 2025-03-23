import DynamicSidebars from '@/components/shared/DynamicSidebars'
import PrivateSection from '@/components/shared/PrivateSection'
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
            <div className='w-full bg-slate-300 h-10 rounded-[10px] flex items-center justify-between'>
            <SidebarTrigger className='hover:bg-slate-300'/>

            <div className='flex items-center'>
              {/* Notifications */}
              <div className='mr-4 cursor-pointer'>
                <BellRingIcon/>
              </div>
              {/* Avatar */}
              <div className='h-8 w-8 rounded-full bg-gray-500 mr-3 cursor-pointer'>

              </div>
            </div>
            </div>
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