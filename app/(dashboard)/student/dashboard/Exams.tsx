"use client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import useUserStore from "@/store/userStore";
import useClassStore from "@/store/useClassStore";

const Exams = () => {
    const examsList = [
        {
            examId: "123456",
            examName: "Mathematics Fundamentals",
            totalQuestions: 10,
            totalMarks: 50,
            completed: false,
        },
        {
            examId: "234567",
            examName: "Advanced Calculus",
            totalQuestions: 10,
            totalMarks: 50,
            completed: false,
        },
        {
            examId: "345678",
            examName: "Programming Basics",
            totalQuestions: 10,
            totalMarks: 50,
            completed: false,
        },
        {
            examId: "456789",
            examName: "Global Historical Perspectives",
            totalQuestions: 10,
            totalMarks: 50,
            completed: true,
        },
    ];
    const { selectClass } = useClassStore();
    const {
        user: { token },
    } = useUserStore();

    return (
        <div>
            <div className="text-2xl font-bold text-gray-800 tracking-tight">
                Your Exams
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 w-full h-full">
                {examsList.map((examsItem) => (
                    <Link
                        href={`/student/exams/${examsItem.examId}`}
                        prefetch={true}
                        key={examsItem.examId}
                    >
                        <Card
                            className="p-0 h-32 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 border-indigo-500"
                            onClick={(e) => {
                                selectClass(examsItem.examId);
                            }}
                        >
                            <CardContent className="p-3 flex h-full flex-col justify-between bg-gradient-to-br from-white to-slate-50">
                                <div className="flex justify-between items-start">
                                    <h2 className="font-bold text-lg text-indigo-700 pr-16">
                                        {examsItem.examName}
                                    </h2>
                                    <h1 className="text-sm text-gray-100 bg-slate-400 rounded-r-full rounded-l-full px-2 py-1 bg-accent/10">
                                        {examsItem.completed
                                            ? "Completed"
                                            : "Pending"}
                                    </h1>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                        <span>
                                            Total Questions:{" "}
                                            {examsItem.totalQuestions || 0}
                                        </span>
                                        <span>
                                            Total Marks:{" "}
                                            {examsItem.totalMarks || 0}
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
