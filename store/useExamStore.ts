import { create } from "zustand";
import { devtools,persist, createJSONStorage } from "zustand/middleware";

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
    totalMarks: number;
};

interface ExamState {
    title: string;
    classId: string;
    date: string;
    startTime: string;
    endTime: string;
    totalMarks: number;
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
    devtools(
        persist(
        (set) => ({
        title: "",
        classId: "",
        date: "",
        startTime: "",
        endTime: "",
        totalMarks: 0,
        questions: [],
        setTitle: (title) => set({ title }),
        setClass: (classId) => set({ classId }),
        setMarks: (marks) => {let totalMarks=marks;set({ totalMarks })},
        setDateTime: (date, startTime, endTime) =>
            set({ date, startTime, endTime }),
        addQuestion: (question) =>
            set((state) => ({ questions: [...state.questions, question] })),
        removeQuestion: (index) =>
            set((state) => ({
                questions: state.questions.filter((_, i) => i !== index),
            })),
        resetForm: () => set(
            {
                title: "",
                classId: "",
                date: "",
                startTime: "",
                endTime: "",
                totalMarks: 0,
                questions: [],
            }
        ),
        setExamMetaData: (data) => set({ ...data }),
        updateQuestion: (index: number, updatedQuestion: Question) =>
            set((state) => {
              const newQuestions = [...state.questions];
              newQuestions[index] = updatedQuestion;
              return { questions: newQuestions };
            }),
    }),    {
        name: 'Exam', // unique name for localStorage key
        storage: createJSONStorage(() => localStorage),
        // You can specify which parts of the state to persist
        partialize: (state) => {
            return ({ title:state.title,
            classId:state.classId,
            date:state.date,
            startTime:state.startTime,
            endTime:state.endTime,
            totalMarks:state.totalMarks,
            questions:state.questions           
             })
        },
      }))
);
