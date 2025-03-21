'use client';
import { useParams } from "next/navigation"

const page = () => {
    const { class_id } = useParams()
  return (
    <div> 
        <h1 className="text-xl">{class_id} Class</h1>
        <h2 className="text-lg text-gray-500">
            This page will show the details of the class with id {class_id}
        </h2>
    </div>
  )
}

export default page