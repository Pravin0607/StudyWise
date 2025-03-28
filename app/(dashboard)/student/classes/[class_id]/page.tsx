"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { MaterialsCard } from "./MaterialsCard";
import { ExamsCard } from "./ExamsCard";
import { ArrowLeft, CircleArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import TeacherDetails from "./TeacherDetails";
import ClassDetails from "./ClassDetails";

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


const sampleMaterials: Material[] = [
    { id: "1", title: "Introduction to React", type: "Lecture" },
    { id: "2", title: "Props and State", type: "Lecture" },
    { id: "3", title: "Component Lifecycle", type: "Assignment" },
    { id: "4", title: "Hooks Explained", type: "Lecture" },
    { id: "5", title: "Midterm Exam", type: "Quiz" },
];

const sampleExams = [
    { id: 1, title: "chapter 1 Exam", type: "MCQ" },
    { id: 2, title: "chapter 2 Exam", type: "Descriptive" },
];

const ClassDashboard = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const class_details = {
        class_name: "React Class"
    }

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
                    Class : <strong>{class_details?.class_name}</strong>
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <MaterialsCard materials={sampleMaterials} {...themeStyles} />
                <ExamsCard exams={sampleExams} {...themeStyles} />
                <TeacherDetails />
                <ClassDetails />
            </div>
        </div>
    );
};

export default ClassDashboard;
