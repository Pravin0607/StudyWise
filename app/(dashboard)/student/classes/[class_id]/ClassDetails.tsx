"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Users, Calendar } from "lucide-react"; 


const ClassDetails = ({name,start_date,students}:{name:string,start_date:string,students:number}) => {
    return (
        <Card className="bg-white shadow-md border border-gray-200">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 tracking-tight">
                    Class Details
                </CardTitle>
                <Separator className="bg-gray-200" />
            </CardHeader>
            <CardContent className="text-gray-700 space-y-6">
                <div className="grid gap-8">
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <BookOpen
                                className="text-blue-500 w-5 h-5"
                                size={20}
                            />
                            <span className="font-medium text-gray-600">
                                Class Name:
                            </span>
                            <span className="text-gray-900 text-lg">
                                {name}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar
                                className="text-blue-500 w-5 h-5"
                                size={20}
                            />{" "}
                            {/* Changed to Calendar */}
                            <span className="font-medium text-gray-600">
                                Start Date:
                            </span>
                            <span className="text-gray-900 text-lg">
                                {start_date}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users
                                className="text-green-500 w-5 h-5"
                                size={20}
                            />
                            <span className="font-medium text-gray-600">
                                Students:
                            </span>
                            <span className="text-gray-900 text-lg">
                                {students}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ClassDetails;
