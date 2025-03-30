"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import useUserStore from "@/store/userStore";
import useClassStore from "@/store/useClassStore";
import { Separator } from "@radix-ui/react-select";
import { useClassStudent } from "@/store/useClassStudent";
import { useEffect } from "react";

const Classes = () => {
    const {classList,selectedClass,setSelectedClass,fetchClassList}=useClassStudent();
    useEffect(()=>{
        (async()=>{
            await fetchClassList();
        })();
    },[])
    return (
        <div>
            <div className="text-2xl font-bold text-gray-800 tracking-tight">
                Your Classes
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full mt-2">
                {classList.map((classItem) => (
                    <Link
                        href={`/student/classes/${classItem.class_id}`}
                        prefetch={true}
                        key={classItem.class_id}
                    >
                        <Card
                            className="p-0 h-32 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 border-indigo-500"
                            onClick={(e) => {
                                setSelectedClass(classItem.class_id);
                            }}
                        >
                            <CardContent className="p-3 flex h-full flex-col justify-between bg-gradient-to-br from-white to-slate-50">
                                <div className="flex justify-between items-start">
                                    <h2 className="font-bold text-lg text-indigo-700 pr-16">
                                        {classItem.class_name}
                                    </h2>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                        <span>
                                            Students: {classItem.total_students || 0}
                                        </span>
                                        <span>
                                            Exams: {classItem.total_exams || 0}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Classes;
