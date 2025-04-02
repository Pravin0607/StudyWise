import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import useUserStore from "./userStore";
import axios from "axios";
import { Endpoints } from "@/lib/apiEndpoints";
import toast from "react-hot-toast";

interface Question {
    _id: string;
    type: string;
    question: string;
    choices: string[];
    correctAnswer: string;
    marks: number;
}

export interface ExamQuestionsWithMetadata {
    exam_id: string;
    title: string;
    class_id: string;
    date: string;
    start_time: string;
    end_time: string;
    total_marks: number;
    questions: Question[];
}

interface ExamEditStoreState {
    examQuestionsWithMetadata: ExamQuestionsWithMetadata | null;
}

interface ExamEditStoreMethods {
    fetchExamQuestionsWithMetadata: (
        examId: string
    ) => Promise<ExamQuestionsWithMetadata | null>;
    updateExam: () => Promise<boolean>;
    setExamQuestionsWithMetadata: (exam: ExamQuestionsWithMetadata) => void;
    updateQuestion: (index: number, updatedQuestion: Question) => void;
    deleteQuestion: (index: number) => void;
}

const useExamEditStore = create<ExamEditStoreState & ExamEditStoreMethods>()(
    devtools(
        persist(
            (set, get) => ({
                examQuestionsWithMetadata: null,
                fetchExamQuestionsWithMetadata: async (examId: string) => {
                    const token = useUserStore.getState().user.token;
                    try {
                        const response = await axios.get(
                            Endpoints.EXAM.GETEXAM.replace(":examId", examId),
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        if (response.status === 200) {
                            set({
                                examQuestionsWithMetadata: response.data
                                    .exam as ExamQuestionsWithMetadata,
                            });
                            return response.data
                                .exam as ExamQuestionsWithMetadata;
                        } else {
                            toast.error(response.data.message);
                            return null;
                        }
                    } catch (error) {
                        console.error(
                            "Error fetching exam questions with metadata:",
                            error
                        );
                        toast.error(
                            "Failed to fetch exam questions with metadata"
                        );
                        return null;
                    }
                },
                updateExam: async () => {
                    const token = useUserStore.getState().user.token;
                    const examData = get().examQuestionsWithMetadata;
                    if (!examData) {
                        toast.error("No exam data to update");
                        return false;
                    }
                    const examId = examData.exam_id;
                    try {
                        console.log("Exam data to update:", examData);
                        const response = await axios.put(
                            Endpoints.EXAM.UPDATEEXAM.replace(
                                ":exam______Id",
                                examId
                            ),
                            examData,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        if (response.status === 200) {
                            set({
                                examQuestionsWithMetadata: response.data
                                    ?.exam as ExamQuestionsWithMetadata,
                            });
                            toast.success(response.data.message);
                            return true;
                        } else {
                            toast.error(response.data.message);
                            return false;
                        }
                    } catch (error) {
                        console.error("Error updating exam:", error);
                        toast.error("Failed to update exam");
                        return false;
                    }
                },
                setExamQuestionsWithMetadata: (
                    exam: ExamQuestionsWithMetadata
                ) => set({ examQuestionsWithMetadata: exam }),
                updateQuestion: (index, updatedQuestion) => {
                    set((state) => {
                        if (!state.examQuestionsWithMetadata) return state;
                        const updatedQuestions = [
                            ...state.examQuestionsWithMetadata.questions,
                        ];
                        updatedQuestions[index] = updatedQuestion;
                        return {
                            examQuestionsWithMetadata: {
                                ...state.examQuestionsWithMetadata,
                                questions: updatedQuestions,
                            },
                        };
                    });
                },
                deleteQuestion: (index) => {
                    set((state) => {
                        if (!state.examQuestionsWithMetadata) return state;
                        const updatedQuestions =
                            state.examQuestionsWithMetadata.questions.filter(
                                (_, i) => i !== index
                            );
                        return {
                            examQuestionsWithMetadata: {
                                ...state.examQuestionsWithMetadata,
                                questions: updatedQuestions,
                            },
                        };
                    });
                },
            }),
            {
                name: "exam-edit-storage",
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);

export default useExamEditStore;
