import PrivateSection from '@/components/shared/PrivateSection'
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