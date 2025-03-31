'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { File, PlusIcon, Pencil, Trash, BookOpen, Filter, Search } from 'lucide-react';
import ExamCreationOptionModal from './ExamCreationOptionModal';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useClassStore from '@/store/useClassStore';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Endpoints } from '@/lib/apiEndpoints';
import useUserStore from '@/store/userStore';

interface Exam {
    exam_id: string;
    title: string;
    class_id: string;
    date: string; //dd-mm-yyyy
    start_time: string; // "01:00 AM"
    end_time: string; // "02:00 AM"
    total_marks: number;
    total_questions: number;
    isCompleted: boolean;
}

interface ExamsCardProps {
    textColor: string;
    cardBgColor: string;
    cardBorderColor: string;
    separatorColor: string;
    itemBgColor: string;
    itemBorderColor: string;
}

export function ExamsCard({
    textColor,
    cardBgColor,
    cardBorderColor,
    separatorColor,
    itemBgColor,
    itemBorderColor
}: ExamsCardProps) {

    const selectedClass=useClassStore(state=>state.selectedClass);
    const [exams, setExams]=useState<Exam[]>([]);
    const token=useUserStore(state=>state.user.token);
    const [filterType, setFilterType] = useState<'all' | 'completed' | 'pending'>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    
    // Helper function to check if an exam is in the past
    const isExamInPast = (examDate: string, examStartTime: string): boolean => {
        const now = new Date();
        
        // Parse the date (dd-mm-yyyy)
        const [day, month, year] = examDate.split('-').map(Number);
        
        // Parse the time (e.g., "01:00 AM")
        const [timeStr, ampm] = examStartTime.split(' ');
        let [hours, minutes] = timeStr.split(':').map(Number);
        
        // Convert from 12-hour to 24-hour format
        if (ampm === 'PM' && hours < 12) {
            hours += 12;
        } else if (ampm === 'AM' && hours === 12) {
            hours = 0;
        }
        
        // Create a date object for the exam date and time
        const examDateTime = new Date(year, month - 1, day, hours, minutes);
        
        // Return true if the exam is in the past
        return examDateTime < now;
    };
    
    const handleDeleteExam = async (examId: string) => {
        // Implement delete logic here
        try{
            const resp=await axios.delete(Endpoints.CLASS.DELETEEXAM.replace(':examId', examId),{
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            });
            if(resp.status===200){
                toast.success('Exam deleted successfully');
                setExams(exams.filter(exam => exam.exam_id !== examId));
                window.location.reload();
            }
        }catch(err)
        {
            console.error('Failed to delete exam:', err);
            toast.error('Failed to delete exam');
        }
    };
    
    // Sort exams by date (newest first)
    const sortedExams = [...exams].sort((a, b) => {
        // Parse dd-mm-yyyy format to a valid date
        const [dayA, monthA, yearA] = a.date.split('-').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA).getTime();
        const [dayB, monthB, yearB] = b.date.split('-').map(Number);
        const dateB = new Date(yearB, monthB - 1, dayB).getTime();
        return dateB - dateA;
    });
    
    // Filter exams based on search query and filter type
    const filteredExams = sortedExams.filter(exam => {
        const matchesFilter = 
            filterType === 'all' || 
            (filterType === 'completed' && exam.isCompleted) || 
            (filterType === 'pending' && !exam.isCompleted);
        
        const matchesSearch = 
            searchQuery === '' || 
            exam.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesFilter && matchesSearch;
    });
    
    useEffect(()=>{
        (async()=>{
            try{
                const resp=await axios.get(Endpoints.STUDENT.GETEXAMLISTBYCLASS.replace(':classId', selectedClass?.class_id!),{
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                });
                if(resp.status===200){
                    setExams(resp.data);
                }else{
                    setExams([]);
                }
            }catch(e){
                console.log(e);
                toast.error("Error fetching exams");
            }
        })();
    },[])

    return (
        <Card className={cn(cardBgColor, cardBorderColor, "shadow-lg")}>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle className={cn("text-lg", textColor)}>Exams</CardTitle>
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <Filter className="h-4 w-4" />
                                    <span>{filterType === 'all' ? 'All Exams' : filterType === 'completed' ? 'Completed' : 'Pending'}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setFilterType('all')}>
                                    All Exams
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterType('pending')}>
                                    Pending Exams
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterType('completed')}>
                                    Completed Exams
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <ExamCreationOptionModal>
                            <Button size={'sm'} variant="outline" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 border-purple-500/30 font-bold h-8 px-2 py-1 text-xs md:h-9 md:px-4 md:py-2 md:text-sm">
                                <span className="hidden sm:inline">Create Exam</span>
                                <span className="sm:hidden">Create</span>
                                <PlusIcon strokeWidth={3.5} className="h-4 w-4 ml-1"/>
                            </Button>
                        </ExamCreationOptionModal>
                    </div>
                </div>
                <Separator className={separatorColor} />
                
                {/* Search input */}
                <div className="relative mt-2">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search exams..."
                        className="pl-8 h-9"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    <div className="space-y-3 text-sm md:text-base">
                        {filteredExams.length > 0 ? (
                            filteredExams.map((exam) => (
                                <div
                                    key={exam.exam_id}
                                    className={cn(
                                        "p-3 rounded-md",
                                        exam.isCompleted 
                                            ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800" 
                                            : "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
                                        textColor,
                                        "border cursor-pointer",
                                        "hover:bg-accent/10 transition-colors duration-200",
                                        "flex justify-between items-center"
                                    )}
                                >
                                    <div className='flex gap-x-3 items-center cursor-pointer'>
                                        <BookOpen className={cn(
                                            "transition-colors",
                                            exam.isCompleted ? "text-green-500" : "text-blue-500"
                                        )}/> 
                                        <span className={cn(
                                            "transition-colors font-medium",
                                            exam.isCompleted ? "text-green-700 dark:text-green-300" : "text-blue-700 dark:text-blue-300"
                                        )}>{exam.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className='font-semibold mr-2 hidden sm:inline'>
                                            {exam.date} | {exam.start_time} - {exam.end_time}
                                        </span>
                                        {!isExamInPast(exam.date, exam.start_time) && (
                                            <Link href={`/teacher/exams/${exam.exam_id}/edit`}>
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className={cn(
                                                        "h-8 w-8",
                                                        exam.isCompleted 
                                                            ? "text-green-700 hover:text-green-600 hover:bg-green-500/20 border-green-500/30" 
                                                            : "text-blue-700 hover:text-blue-600 hover:bg-blue-500/20 border-blue-500/30"
                                                    )}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon" className="h-8 w-8">
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Exam</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete <span className="font-bold">{exam.title}</span>? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteExam(exam.exam_id)}>
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                                <File className={`h-16 w-16 ${textColor} opacity-20 mb-4`} />
                                <p className={`${textColor} font-medium`}>
                                    {searchQuery ? 'No exams match your search' : 
                                     filterType === 'all' ? 'No exams scheduled' : 
                                     filterType === 'completed' ? 'No completed exams' : 
                                     'No pending exams'}
                                </p>
                                <p className={`${textColor} opacity-70 text-sm mt-1`}>
                                    {filterType === 'all' && !searchQuery ? "Click 'Create Exam' to schedule assessments" : ''}
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}