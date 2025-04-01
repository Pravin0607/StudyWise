"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ExamDetails from "./ExamDetails";
import useStudentExamStore from "@/store/useStudentExamStore";

// Keep your sample data here
interface ExamMetaData{
    exam_id: string;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    total_marks: number;
    questions: any[];
    total_questions: number;
}
/*
    "ExamMetaData": {
        "exam_id": "c69e3633-cc8c-4071-b5c2-8ba179254428",
        "title": "Semister End",
        "date": "2025-03-27T00:00:00.000Z",
        "start_time": "16:00",
        "end_time": "17:00",
        "total_marks": 30,
        "questions": [],
        "total_questions": 2
    }
*/






const ExamDashboard = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const {exam_id}=useParams();
    const exam_details=useStudentExamStore(state=>state.examsMetadata);
    const {fetchExamMetadata,fetchExamQuestionsWithMetadata}=useStudentExamStore()
    useEffect(()=>{
        (async()=>{
            await fetchExamMetadata(exam_id as string);
            await fetchExamQuestionsWithMetadata(exam_id as string);
        })();
    },[])
    const themeStyles = {
        textColor: theme === "dark" ? "text-gray-200" : "text-gray-800",
        cardBgColor: theme === "dark" ? "bg-gray-800" : "bg-white",
        cardBorderColor:
            theme === "dark" ? "border-gray-700" : "border-gray-200",
        separatorColor: theme === "dark" ? "bg-gray-700" : "bg-gray-200",
        itemBgColor: theme === "dark" ? "bg-gray-700/50" : "bg-gray-100/50",
        itemBorderColor:
            theme === "dark" ? "border-gray-700/80" : "border-gray-200/80",
    };

    return (
        <div className="flex-1 p-2">
            <div className="flex sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Back</span>
                </button>
                <h1
                    className={cn(
                        "text-xl font-bold flex-1 text-center",
                        themeStyles.textColor
                    )}
                >
                    Exam Name: <strong>{exam_details?.title}</strong>
                </h1>
            </div>

            <div>
                <ExamDetails />
            </div>
        </div>
    );
};

export default ExamDashboard;
