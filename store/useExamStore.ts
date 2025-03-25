import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Question {
    type: "mcq" | "descriptive";
    question: string;
    choices?: string[];
    correctAnswer?: string; // Added correct answer for MCQs
    marks: number;
}

type ExamMetaData = {
    title: string;
    classId: string;
    date: string;
    startTime: string;
    endTime: string;
    marks: number;
};

interface ExamState {
    title: string;
    classId: string;
    date: string;
    startTime: string;
    endTime: string;
    marks: number;
    questions: Question[];
    setTitle: (title: string) => void;
    setClass: (classId: string) => void;
    setMarks: (marks: number) => void;
    setDateTime: (date: string, startTime: string, endTime: string) => void;
    addQuestion: (question: Question) => void;
    removeQuestion: (index: number) => void;
    resetForm: () => void;
    setExamMetaData: (data: ExamMetaData) => void;
    updateQuestion: (index: number, updatedQuestion: Question) => void;
}

export const useExamStore = create<ExamState>()(
    devtools((set) => ({
        title: "",
        classId: "",
        date: "",
        startTime: "",
        endTime: "",
        marks: 0,
        questions: [],
        setTitle: (title) => set({ title }),
        setClass: (classId) => set({ classId }),
        setMarks: (marks) => set({ marks }),
        setDateTime: (date, startTime, endTime) =>
            set({ date, startTime, endTime }),
        addQuestion: (question) =>
            set((state) => ({ questions: [...state.questions, question] })),
        removeQuestion: (index) =>
            set((state) => ({
                questions: state.questions.filter((_, i) => i !== index),
            })),
        resetForm: () => set({ title: "", classId: "", questions: [] }),
        setExamMetaData: (data) => set({ ...data }),
        updateQuestion: (index: number, updatedQuestion: Question) =>
            set((state) => {
              const newQuestions = [...state.questions];
              newQuestions[index] = updatedQuestion;
              return { questions: newQuestions };
            }),
    }))
);
