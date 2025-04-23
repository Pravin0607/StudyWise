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
            {classList.length === 0 ? (
                <div className="mt-4 flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-dashed border-gray-300">
                    <div className="h-24 w-24 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">No Classes Yet</h3>
                    <p className="mt-2 text-center text-gray-500">You haven't joined any classes yet. Classes will appear here once Teacher adds you.</p>
                </div>
            ) : (
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
            )}
        </div>
    );
};

export default Classes;
