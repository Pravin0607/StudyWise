'use client';
import React from 'react'
import ShowResultModal from './showResultModal'
import { useParams } from 'next/navigation'

const page = () => {
    const {exam_id}=useParams();
  return (
    <ShowResultModal exam_id={exam_id as string}/>
  )
}

export default page