import {create} from 'zustand';
import {persist,devtools} from 'zustand/middleware';
import useUserStore from './userStore';
import axios from 'axios';
import { Endpoints } from '@/lib/apiEndpoints';
// useUserStore contains a user object with a token property
import toast from 'react-hot-toast';

type TClass={
    class_name: string;
    class_id: string;
    total_students: number;
    total_exams: number;
    created_at: string;
};
type TExam={
    exam_id: string;
    title: string;
    class_id: string;
    date: string;
    start_time: string;
    end_time: string;
    total_marks: number;
    total_questions: number;
    isCompleted: boolean;
}
interface ClassStudentState {
    classList:TClass[];
    examList:TExam[];
    selectedClass?: TClass;
}
interface ClassStudentActions {
    fetchClassList: () => Promise<void>;
    fetchExamList: () => Promise<void>;
    setSelectedClass: (classId:string) => void;
}

export const useClassStudent = create<ClassStudentState & ClassStudentActions>()(
  devtools(
    (set)=>({
        classList: [],
        examList: [],
        selectedClass: {} as TClass,
        fetchClassList: async () => {
            try{
                const { user: { token } } = useUserStore.getState();
                const response =  await axios.get(Endpoints.STUDENT.GETCLASSLIST,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                set({ classList: response.data });
            }catch (error) {
                console.error('Error fetching class list:', error);
                toast.error('Error fetching class list');
            }
        },
        fetchExamList: async () => {
            try{
                const { user: { token } } = useUserStore.getState();
                const response =  await axios.get(Endpoints.STUDENT.GETEXAMLIST,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                set({ examList: response.data });
            }catch (error) {
                console.error('Error fetching exam list:', error);
                toast.error('Error fetching exam list');
            }
        },
        setSelectedClass: (classId:string) => {
            const selectedClass = useClassStudent.getState().classList.find((classItem) => classItem.class_id === classId);
            if (selectedClass) {
                set({ selectedClass: selectedClass });
            } else {
                console.error('Class not found');
                toast.error('Class not found');
            }
        }
    })

  ))