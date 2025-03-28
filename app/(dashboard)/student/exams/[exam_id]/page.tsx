"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ArrowLeft, CircleArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ExamDetails from "./ExamDetails";

// Keep your sample data here
interface Student {
    id: string;
    name: string;
}

interface Material {
    id: string;
    title: string;
    type: string;
}


const ExamDashboard = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const exam_details = {
        exam_name: "React Exam",
    };

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
                    Exam Name: <strong>{exam_details?.exam_name}</strong>
                </h1>
            </div>

            <div>
                <ExamDetails/>
            </div>
        </div>
    );
};

export default ExamDashboard;
