import { Card, CardContent, } from '@/components/ui/card';
import { H4 } from '@/components/ui/typography';
import Link from 'next/link';
import React from 'react'

const classNav=[
    {
        title:'Students',
        link:'/students'
    },
    {
        title:'Subjects',
        link:'/subjects'
    },
    {
        title:'Analytics',
        link:'/analytics'
    },
    {
        title:'Attendence',
        link:'/attendence'
    }
]
const page = async({params}:{
    params: Promise<{ classId: number }>
  }) => {
    const id=(await params).classId;
  
  return (
    <div className='space-y-4'>
    <div>class No {id}</div>
    <hr />         
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4'>
        {
            classNav.map((item,index)=>(
                <Link key={index} href={`/classes/${id}${item.link}`}>
                <Card className='p-4 cursor-pointer '>
                    <CardContent className=' min-h-24 flex justify-center items-center p-2'>
                        <H4>{item.title}</H4>
                    </CardContent>
                </Card>
                </Link>
            ))
        }
    </div>
    </div>
    

  )
}

export default page