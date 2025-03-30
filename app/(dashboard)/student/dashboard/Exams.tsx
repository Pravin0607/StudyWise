"use client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useClassStudent } from "@/store/useClassStudent";
import { useEffect } from "react";
import { CalendarDays, Clock } from "lucide-react";

type TExam = {
    exam_id: string;
    title: string;
    class_id: string;
    date: string;
    start_time: string;
    end_time: string;
    total_marks: number;
    total_questions: number;
    isCompleted: boolean;
};

const Exams = () => {
    const { examList, fetchExamList } = useClassStudent();
    useEffect(() => {
        (async () => {
            await fetchExamList();
        })();
    }, []);
    return (
        <div>
            <div className="text-2xl font-bold text-gray-800 tracking-tight">
                Your Exams
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 w-full h-full">
                {examList.map((examsItem: TExam) => (
                    <Link
                        href={`/student/exams/${examsItem.exam_id}`}
                        prefetch={true}
                        key={examsItem.exam_id}
                    >
                        <Card
                            className="p-0 h-40 max-h-48 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 border-indigo-500"
                        >
                            <CardContent className="p-3 flex h-full flex-col justify-between bg-gradient-to-br from-white to-slate-50">
                                <div className="flex justify-between items-start">
                                    <h2 className="font-bold text-lg text-indigo-700 pr-16">
                                        {examsItem.title}
                                    </h2>
                                    <div className="flex items-center justify-center">
                                        {examsItem.isCompleted ? (
                                            <div className="flex items-center gap-2 text-sm rounded-full px-3 py-1 bg-green-100 text-green-700 font-semibold">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    className="w-4 h-4"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.97 3.97 7.473-9.819a.75.75 0 011.05-.143z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Completed
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm rounded-full px-3 py-1 bg-red-100 text-red-700 font-semibold">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-4 h-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 6v6h4.5m-4.5 0a9 9 0 110 18 9 9 0 010-18z"
                                                    />
                                                </svg>
                                                Pending
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-1 gap-y-3 mt-2">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CalendarDays height={20}/>
                                        <span className="text-sm">
                                            {examsItem.date}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock height={20}/>

                                        <span className="text-sm">
                                            {examsItem.start_time} -{" "}
                                            {examsItem.end_time}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                        <span>
                                            Total Questions:
                                            {examsItem.total_questions || 0}
                                        </span>
                                        <span>
                                            Total Marks:
                                            {examsItem.total_marks || 0}
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

export default Exams;
