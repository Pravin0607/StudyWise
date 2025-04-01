"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useClassStudent } from "@/store/useClassStudent";
import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import useExamResultStore from "@/store/useExamResult";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

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
    const  {fetchExamResults,examResults}=useExamResultStore();
    const [open, setOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState<TExam | null>(null);

    useEffect(() => {
        (async () => {
            await fetchExamList();
            await fetchExamResults();
        })();
    }, []);
    const isExamAttempted = (examId: string): boolean => {
        return examResults?.some((result) => result.exam_id === examId) || false;
    };
    const handleCardClick = (exam: TExam) => {
        setSelectedExam(exam);
        setOpen(true);
    };
    const getExamResult = (examId: string) => {
        return examResults?.find((result) => result.exam_id === examId);
    };
    return (
        <div>
            <div className="text-2xl font-bold text-gray-800 tracking-tight">
                Your Exams
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 w-full h-full">
                {examList.map((examsItem: TExam) => {
                    const attempted = isExamAttempted(examsItem.exam_id);
                    return (
                        <Card
                            key={examsItem.exam_id}
                            className="p-0 h-40 max-h-48 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 border-indigo-500"
                            onClick={() => handleCardClick(examsItem)}
                        >
                            <CardContent className="p-3 flex h-full flex-col justify-between bg-gradient-to-br from-white to-slate-50">
                                <div className="flex justify-between items-start">
                                    <h2 className="font-bold text-lg text-indigo-700 pr-16">
                                        {examsItem.title}
                                    </h2>
                                    <div className="flex items-center justif</svg>y-center">
                                        {attempted ? (
                                            <div className="flex items-center gap-2 text-sm rounded-full px-3 py-1 bg-blue-100 text-blue-700 font-semibold">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                    <path d="M2.695 6.351a.75.75 0 011.04-.037l4.5 6a.75.75 0 01-.99 1.125L2.695 6.351zM17.25 6.782l-4.5 6a.75.75 0 01-.99 1.125l4.5-6a.75.75 0 011.04.037zM4.75 4a.75.75 0 00-1.5 0v1.5h1.5V4zm12 0a.75.75 0 00-1.5 0v1.5h1.5V4zM10 2.5a.75.75 0 01.75.75v1.5h-1.5V3.25a.75.75 0 01.75-.75zM5.714 15.75a.75.75 0 01.969.045l3.5 4.666a.75.75 0 01-1.014 1.133l-3.5-4.667a.75.75 0 01.045-.967zM14.286 15.75a.75.75 0 00-.969.045l-3.5 4.666a.75.75 0 001.014 1.133l3.5-4.667a.75.75 0 00-.045-.967zM18.5 14.25a.75.75 0 010 1.5h-1.5v-1.5h1.5zm-12 0a.75.75 0 010 1.5h-1.5v-1.5h1.5zM10 18.5a.75.75 0 00-.75-.75h-1.5v1.5h1.5a.75.75 0 00.75-.75z" />
                                                </svg>
                                                Attempted
                                            </div>
                                        ) : examsItem.isCompleted ? (
                                            !attempted ? (
                                                <div className="flex items-center gap-2 text-sm rounded-full px-3 py-1 bg-yellow-100 text-yellow-700 font-semibold">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Missed
                                                </div>
                                            ) : (
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
                                                    Passed
                                                </div>
                                            )
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
                    );
                })}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
    {selectedExam && (
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-indigo-700">
                    {selectedExam.title}
                </DialogTitle>
                <DialogDescription className="mt-4" asChild>
                    {isExamAttempted(selectedExam.exam_id) ? (
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Exam Results</h3>
                                {getExamResult(selectedExam.exam_id) ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                            <span className="text-gray-600">Marks Obtained</span>
                                            <span className="font-semibold text-indigo-600">
                                                {getExamResult(selectedExam.exam_id)?.total_marks_obtained}/{selectedExam.total_marks}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                            <span className="text-gray-600">Percentage</span>
                                            <span className="font-semibold text-indigo-600">
                                                {getExamResult(selectedExam.exam_id)?.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-yellow-600">Result is being processed.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {selectedExam.isCompleted ? (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                You didn't attempt this exam. The exam period has ended.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Exam Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <CalendarDays className="h-5 w-5 text-indigo-500" />
                                            <span>Date: {selectedExam.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="h-5 w-5 text-indigo-500" />
                                            <span>Time: {selectedExam.start_time} - {selectedExam.end_time}</span>
                                        </div>
                                        <div className="flex justify-between mt-4 pt-4 border-t">
                                            <div className="text-gray-600">
                                                <span className="font-semibold">Questions:</span> {selectedExam.total_questions}
                                            </div>
                                            <div className="text-gray-600">
                                                <span className="font-semibold">Total Marks:</span> {selectedExam.total_marks}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    )}
</Dialog>
        </div>
    );
};

export default Exams;
