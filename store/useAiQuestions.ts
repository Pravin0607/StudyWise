import { create } from 'zustand';
import { Endpoints } from "@/lib/apiEndpoints";
import axios from "axios";
import toast from "react-hot-toast";
import { devtools } from 'zustand/middleware';

interface Question {
    type: string;
    question: string;
    choices: string[];
    correctAnswer: string;
    marks: number;
}

interface AiQuestionsState {
    questions: Question[];
    totalMarks: number;
    isLoading: boolean;
    setQuestions: (questions: Question[], totalMarks: number) => void;
    clearQuestions: () => void;
    getQuestions: (material_id: string, type: string, total_questions: number, totalMarks: number, token: string) => Promise<any>;
    submitExam: (examData: Record<string, any>, token: string) => Promise<boolean>;
}

const useAiQuestions = create<AiQuestionsState>()(devtools((set) => ({
        questions: [],
        totalMarks: 0,
        isLoading: false,
        setQuestions: (questions, totalMarks) => set({ questions, totalMarks }),
        clearQuestions: () => set({ questions: [], totalMarks: 0 }),
        getQuestions: async (material_id, type = 'mcq', total_questions, totalMarks, token) => {
            if (!material_id) {
                toast.error("Please select a material");
                return;
            }
            
            set({ isLoading: true, questions: [] }); // Clear previous questions
            
            try {
                const response = await axios.post(Endpoints.EXAM.AIEXAM, {
                    materialId: material_id,
                    type,
                    total_questions,
                    totalMarks
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (response.status === 200) {
                    toast.success("Questions generated successfully");
                    set({ 
                        questions: response.data.questions, 
                        totalMarks: totalMarks,
                        isLoading: false 
                    });
                    return response.data;
                } else {
                    throw new Error("Failed to generate questions");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error generating questions");
                set({ isLoading: false, questions: [] });
                return null;
            }
        },
        submitExam: async (examData, token) => {
            try {
                const response = await axios.post(Endpoints.EXAM.SUBMITAIEXAM, examData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
        
                if (response.status === 201) {
                    toast.success("Exam submitted successfully");
                    return true;
                } else {
                    toast.error(response.data.message || "Failed to submit exam");
                    return false;
                }
            } catch (err) {
                console.error(err);
                toast.error("Error submitting exam");
                return false;
            }
        }
    })
));

export default useAiQuestions;