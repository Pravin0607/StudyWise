'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'; // Add Input import
import { Endpoints } from '@/lib/apiEndpoints';
import { cn } from "@/lib/utils";
import { useClassStudent } from '@/store/useClassStudent';
import useUserStore from '@/store/userStore';
import axios from 'axios';
import { File, PlusIcon, Pencil, Trash, Filter, Search } from 'lucide-react'; // Add Search icon
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Exam {
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

        const token = useUserStore((state) => state.user.token);
        const [examsList, setExamsList] = useState<Exam[]>([]);
        const [filterType, setFilterType] = useState<'all' | 'completed' | 'pending'>('all');
        const [searchQuery, setSearchQuery] = useState<string>(''); // Add search query state
        
        // sort the exams by date and isCompleted
        const sortedExamsList = [...examsList].sort((a, b) => {
                // Parse dd-mm-yyyy format to a valid date
                const [dayA, monthA, yearA] = a.date.split('-').map(Number);
                const dateA = new Date(yearA, monthA - 1, dayA).getTime();
                const [dayB, monthB, yearB] = b.date.split('-').map(Number);
                const dateB = new Date(yearB, monthB - 1, dayB).getTime();
                return dateB - dateA;
        });
        
        // filter the exams based on selected filter and search query
        const filteredExamsList = sortedExamsList.filter(exam => {
                const matchesFilter = 
                    filterType === 'all' || 
                    (filterType === 'completed' && exam.isCompleted) || 
                    (filterType === 'pending' && !exam.isCompleted);
                
                const matchesSearch = 
                    searchQuery === '' || 
                    exam.title.toLowerCase().includes(searchQuery.toLowerCase());
                
                return matchesFilter && matchesSearch;
        });
        
        const selectedClassId=useClassStudent(s=>s.selectedClass?.class_id);
        useEffect(()=>{
                (async()=>{
                        try{
                                const resp=await axios.get(Endpoints.STUDENT.GETEXAMLISTBYSTUDENT.replace(":classId",selectedClassId!),{
                                        headers: {
                                                Authorization: `Bearer ${token}`,
                                        },
                                })
                                setExamsList(resp?.data || []);
                        }catch(error){
                                console.error('Error fetching class list:', error);
                                toast.error('Error fetching class list');
                        }
                })();
        },[])

        return (
                <Card className={cn(cardBgColor, cardBorderColor, "shadow-lg")}>
                        <CardHeader>
                                <div className="flex justify-between items-center">
                                        <CardTitle className={cn("text-lg", textColor)}>
                                                Exams
                                        </CardTitle>
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
                                                {filteredExamsList.length > 0 ? (
                                                        filteredExamsList.map((exam) => (
                                                                <div
                                                                        key={exam.exam_id}
                                                                        className={cn(
                                                                                "p-3 rounded-md",
                                                                                exam.isCompleted ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800" : "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
                                                                                textColor,
                                                                                "border",
                                                                                "group hover:bg-accent/10 transition-colors duration-200",
                                                                                "flex justify-between items-center flex-col sm:flex-row"
                                                                        )}
                                                                >
                                                                        <div className="flex gap-x-3 items-center cursor-pointer mb-2 sm:mb-0">
                                                                                <File className={cn(
                                                                                        "transition-colors",
                                                                                        exam.isCompleted ? "text-green-500" : "text-blue-500"
                                                                                )} />
                                                                                <span className={cn(
                                                                                        "transition-colors font-medium",
                                                                                        exam.isCompleted ? "text-green-700 dark:text-green-300" : "text-blue-700 dark:text-blue-300"
                                                                                )}>
                                                                                        {exam.title}
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                                <span className="font-semibold mr-2 hidden sm:inline">
                                                                                        {exam.date}
                                                                                </span>
                                                                                {!exam.isCompleted ? (
                                                                                        <Button
                                                                                                variant="outline"
                                                                                                className="hover:bg-accent hover:text-accent-foreground bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300"
                                                                                        >
                                                                                                Take Exam
                                                                                        </Button>
                                                                                ) : (
                                                                                        <Button
                                                                                                variant="outline"
                                                                                                className="hover:bg-accent hover:text-accent-foreground bg-green-100 border-green-300 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300"
                                                                                        >
                                                                                                View Score
                                                                                        </Button>
                                                                                )}
                                                                        </div>
                                                                </div>
                                                        ))
                                                ) : (
                                                        <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                                                                <File
                                                                        className={`h-16 w-16 ${textColor} opacity-20 mb-4`}
                                                                />
                                                                <p className={`${textColor} font-medium`}>
                                                                        {searchQuery ? 'No exams match your search' : 
                                                                         filterType === 'all' ? 'No exams scheduled' : 
                                                                         filterType === 'completed' ? 'No completed exams' : 
                                                                         'No pending exams'}
                                                                </p>
                                                        </div>
                                                )}
                                        </div>
                                </ScrollArea>
                        </CardContent>
                </Card>
        );
}