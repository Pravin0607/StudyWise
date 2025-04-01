import {create} from 'zustand';
import { devtools } from 'zustand/middleware';
import useUserStore from './userStore';
import axios from 'axios';
import toast, { Toast } from 'react-hot-toast'; 
import { Endpoints } from '@/lib/apiEndpoints';
// useUserStore contains the user token state.user.token

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
interface Question{
_id: string;
"type": string;
question: string;
choices: string[];
correctAnswer: string;
marks: number;
userAnswer: string;
isAnswered: boolean;
isCorrect: boolean;
};

interface ExamQuestionsWithMetadata{
        exam_id: string;
        title: string;
        class_id: string;
        date: string;
        start_time: string;
        end_time: string;
        total_marks: number;
        questions: Question[];
}

interface ExamDetails{
    exam_started?: string;
    exam_ended?: string;
    exam_statistics?: {
        total_marks_obtained: number;
        total_possible_marks: number;
        percentage: number;
    }
}
interface ExamStoreState{
    examsMetadata: ExamMetaData | null;
    examQuestionsWithMetadata: ExamQuestionsWithMetadata | null;
    examDetails: ExamDetails | null;
}

interface ExamStoreMethods{
    fetchExamMetadata: (examId:string)=>Promise<ExamMetaData | null>;
    fetchExamQuestionsWithMetadata: (examId:string)=>Promise<ExamQuestionsWithMetadata | null>;
    updateAnswer: (questionIndex:number, answer:string)=>void;
    setExamStartedTime: ()=>void;
    setExamEndedTime: ()=>void;
    submitExam: ()=>Promise<void>;
}

const useStudentExamStore = create<ExamStoreState & ExamStoreMethods>()(
    devtools((set)=>({
        examsMetadata: null,
        examQuestionsWithMetadata: null,
        fetchExamMetadata: async(examId:string)=>{
            const token=useUserStore.getState().user.token;
            try{
                const response =await axios.get(Endpoints.EXAM.GETEXAMMETADATA.replace(":examId",examId),{
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                });
                if(response.status===200){
                    set({examsMetadata:response.data?.ExamMetaData as ExamMetaData});
                    return response.data?.ExamMetaData as ExamMetaData;
                }else{
                    toast.error(response.data.message);
                    return null;
                }
            }catch(error){
                console.error("Error fetching exam metadata:", error);
                toast.error("Failed to fetch exam metadata");
                return null;
            }
        },
        fetchExamQuestionsWithMetadata: async(examId:string)=>
            {
            const token=useUserStore.getState().user.token;
            try{
                const response = await axios.get(Endpoints.EXAM.GETEXAM.replace(":examId",examId),{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                if(response.status===200){
                    set({examQuestionsWithMetadata:response.data?.exam as ExamQuestionsWithMetadata});
                    return response.data as ExamQuestionsWithMetadata;
                }else{
                    toast.error(response.data.message);
                    return null;
                }
            }catch(error){
                console.error("Error fetching exam questions with metadata:", error);
                toast.error("Failed to fetch exam questions with metadata");
                return null;
            }
        },
        setExamStartedTime:()=>{
            set({examDetails:{exam_started:new Date().toISOString()}});
        },
        setExamEndedTime:()=>{
            set({examDetails:{exam_ended:new Date().toISOString()}});
        },
        updateAnswer: (questionIndex:number, answer:string)=>{
            // Update the answer for the question at questionIndex
            set((state) => {
                state.examQuestionsWithMetadata!.questions[questionIndex].userAnswer = answer;
                state.examQuestionsWithMetadata!.questions[questionIndex].isAnswered = true;
                state.examQuestionsWithMetadata!.questions[questionIndex].isCorrect = answer === state.examQuestionsWithMetadata!.questions[questionIndex].correctAnswer;
                // Optionally, you can show a toast notification here
                toast.success("Answer updated successfully");
                // Return the updated state
                return state;
            })
        },
        submitExam: async()=>{
            // Submit the exam answers to the server
            const token=useUserStore.getState().user.token;
            let id:string='';
            try{
                // Prepare the data to be submitted
                /*
                class_id: string;
                exam_id: string;
                questions: {
                    _id: string;
                    userAnswer: string;
                    isAnswered: boolean;
                    isCorrect: boolean;
                    correctAnswer: string;
                    marks: number;
                    question: string;
                    type: string;
                }[];
                exam_started: string;
                exam_ended: string;
                 */
                const {exam_id, class_id, questions} = useStudentExamStore.getState().examQuestionsWithMetadata!;
                const {exam_started, exam_ended} = useStudentExamStore.getState().examDetails!;
                const data = {
                    class_id,
                    exam_id,
                    questions: questions.map((question) => ({
                        _id: question._id,
                        userAnswer: question.userAnswer,
                        isAnswered: question.isAnswered,
                        isCorrect: question.isCorrect,
                        correctAnswer: question.correctAnswer,
                        marks: question.marks,
                        question: question.question,
                        type: question.type
                    })),
                    exam_started,
                    exam_ended
                };
                id=toast.loading("Submitting exam...");
                // console.log("Submitting exam data:", data);
                const result=await axios.post(Endpoints.EXAM.SUBMITEXAM,data,{
                    headers:{ Authorization:`Bearer ${token}` }
                });
                if(result.status==201){
                    // toast.error(result.data.message,{id});
                    toast.success("Exam submitted successfully", {id});
                    // console.log("Exam submitted successfully:", result.data);
                    // set the analytics
                    set({examDetails:{
                        exam_statistics: {
                            total_marks_obtained: result.data.data.total_marks_obtained,
                            total_possible_marks: result.data.data.total_possible_marks,
                            percentage: result.data.data.percentage
                        }
                    }});
                    return;
                
                }else{
                //  toast.dismiss(id); 
                 toast.error(result.data.message,{id});
                    return;  
                }
            }catch(error){
                console.error("Error submitting exam:", error);
                toast.error("Failed to submit exam",{id});
            }
        },

}))
)

export default useStudentExamStore;