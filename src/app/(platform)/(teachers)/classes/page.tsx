import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { H1, H3 } from "@/components/ui/typography"
import Link from "next/link"

const page = () => {
  return (
    <div className="space-y-4">
        <H1>Classes</H1>
        <hr />
        <div className="flex gap-3">
          <Input placeholder="Class Name" />
          <Button>Create Class</Button>
        </div>
        <hr />
        <div>
          <H3>Class List</H3>
          <ul>
          {[1,2,3,4,5].map((id)=>(<Link href={`/classes/${id}`} key={id}><li>Class 1</li></Link>))}
          </ul>
        </div>
    </div>
  )
}

export default page