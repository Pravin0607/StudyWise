import React from 'react'
import Classes from './Classes'
import Exams from './Exams'

function page() {
  return (
    <div className='p-4 space-y-4'>
      <Classes />
      <Exams />
    </div>
  )
}

export default page