'use client';
import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useTheme } from 'next-themes';
import { StudentsCard } from './StudentsCard';
import { MaterialsCard } from './MaterialsCard';
import { ExamsCard } from './ExamsCard';
import { ArrowLeft, CircleArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import useClassStore from '@/store/useClassStore';
import { getMaterialsByClassId } from '@/services/materialsServices';
import useUserStore from '@/store/userStore';
import { useMaterialStore } from '@/store/useMaterialStore';

// Keep your sample data here
interface Student {
    id: string;
    name: string;
}



const sampleExams=[
    {id:1,title:"chapter 1 Exam",type:'MCQ'},
    {id:2,title:'chapter 2 Exam',type:'Descriptive'}
]

const ClassDashboard = () => {
    const { theme } = useTheme();
    const router=useRouter();
    const {class_id}=useParams();
    const class_details=useClassStore(state=>state.selectedClass);
    const fetchStudents=useClassStore(state=>state.fetchStudentsByClassId);
    const studentDetails=useClassStore(state=>state.studentsDetails);
    const token=useUserStore(state=>state.user.token);
    const {classMaterials,setClassMaterials,fetchMaterialsByClassId}=useMaterialStore();
    useEffect(()=>{
        fetchStudents(class_id as string);
        (async ()=>{
           const data:any=await getMaterialsByClassId(class_id as string,token as string);
           fetchMaterialsByClassId(class_id as string,token as string);
        })()
    },[])
    
    const themeStyles = {
        textColor: theme === 'dark' ? 'text-gray-200' : 'text-gray-800',
        cardBgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        cardBorderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        separatorColor: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200',
        itemBgColor: theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50',
        itemBorderColor: theme === 'dark' ? 'border-gray-700/80' : 'border-gray-200/80',
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
            <h1 className={cn("text-xl font-bold flex-1 text-center", themeStyles.textColor)}>
                Class : <strong>
                    {class_details?.class_name}
                    </strong>
            </h1>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <StudentsCard
                    students={studentDetails ?? []}
                    {...themeStyles}
                />
                <MaterialsCard 
                    materials={classMaterials}
                    {...themeStyles}
                />
                <ExamsCard
                    exams={sampleExams}
                    {...themeStyles}
                />
            </div>
        </div>
    );
};


export default ClassDashboard;
