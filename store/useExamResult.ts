import {create} from 'zustand';
import { devtools } from 'zustand/middleware';
import useUserStore from './userStore';
import axios from 'axios';
import { Endpoints } from '@/lib/apiEndpoints';

// 
interface ExamResult{
    exam_id: string;
    total_marks_obtained: number;
    total_possible_marks: number;
    percentage: number;
}
interface ExamResultStoreState{
    examResults: ExamResult[] | null;
}
interface ExamResultStoreMethods{
    fetchExamResults: ()=>void;
}

const useExamResultStore = create<ExamResultStoreState & ExamResultStoreMethods>()(devtools((set)=>({
    examResults:[],
    fetchExamResults: async () => {
        const { token ,id} = useUserStore.getState().user;
        try {
            const resp=await axios.get(Endpoints.EXAM.EXAMRESULTBYSTUDENTID.replace(":studentId",id as string),{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(resp.status===200)
            {
                set({examResults:resp?.data?.data as ExamResult[] || []});
            }
            else
            {
                console.error('Error fetching exam results:', resp.data.message);
            }
        }
        catch(err)
        {
            console.error('Error fetching exam results:', err);
        }
},

})))

export default useExamResultStore;