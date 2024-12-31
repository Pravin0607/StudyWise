import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell,  TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { H4 } from '@/components/ui/typography'
import React from 'react'

const page = () => {
  return (
    <div className='space-y-2'>
        <H4>Students</H4>
        <hr />
        <div className='flex space-x-2'>
        <Input placeholder='Student Name' className=''/>
        <Button>Add Student</Button>
        </div>
        <div>
        <Table>
  <TableCaption>A list of Students.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead colSpan={3}>
      <div className='flex space-x-2'>
          <Input placeholder='Search students' className='flex' />
          <Button>Search</Button>
        </div>
      </TableHead>
    </TableRow>
    <TableRow>
      <TableHead className="w-[100px]">Id</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Ram Kasar</TableCell>
      <TableCell>
        <Button variant={'destructive'}>Delete</Button>
      </TableCell>
    </TableRow>
  </TableBody>

</Table>

        </div>
    </div>
  )
}

export default page