import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
const classes=[{name:"Class 1"},{name:"Class 2"},{name:"Class 3"}]
const Classes = () => {
  return (
    <div>
      <div className="my-2">
        <Button className=""><Plus/> Create Class</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full">
        {classes.map((classItem, index) => (
          <Link href={`/teacher/classes/${index}`} key={index}>
          <Card className="p-0 h-32 cursor-pointer">
        <CardContent className="p-2 flex h-full flex-col items-center justify-center">
          <h1>{classItem.name}</h1>
        </CardContent>
          </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Classes