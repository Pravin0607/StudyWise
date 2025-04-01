'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Endpoints } from '@/lib/apiEndpoints';
import { cn } from "@/lib/utils";
import { useClassStudent } from '@/store/useClassStudent';
import useUserStore from '@/store/userStore';
import axios from 'axios';
import { File, Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from 'next/link';
import useExamResultStore from '@/store/useExamResult';
// import { Badge } from "@/components/ui/badge"
import { Label } from '@/components/ui/label';

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
    itemBorderColor,
}: ExamsCardProps) {
    const token = useUserStore((state) => state.user.token);
    const [examsList, setExamsList] = useState<Exam[]>([]);
    const [filterType, setFilterType] =
        useState<'all' | 'completed' | 'pending'>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const {fetchExamResults,examResults}=useExamResultStore();
    const [open, setOpen] = useState(false);
    const [selectedExamResult, setSelectedExamResult] = useState<any | null>(null);

    const sortedExamsList = [...examsList].sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('-').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA).getTime();
        const [dayB, monthB, yearB] = b.date.split('-').map(Number);
        const dateB = new Date(yearB, monthB - 1, dayB).getTime();
        return dateB - dateA;
    });

    const filteredExamsList = sortedExamsList.filter((exam) => {
        const matchesFilter =
            filterType === 'all' ||
            (filterType === 'completed' && exam.isCompleted) ||
            (filterType === 'pending' && !exam.isCompleted);

        const matchesSearch =
            searchQuery === '' ||
            exam.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const selectedClassId = useClassStudent((s) => s.selectedClass?.class_id);
    useEffect(() => {
        (async () => {
            try {
                const resp = await axios.get(
                    Endpoints.STUDENT.GETEXAMLISTBYSTUDENT.replace(
                        ':classId',
                        selectedClassId!
                    ),
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setExamsList(resp?.data || []);
                await fetchExamResults();
            } catch (error) {
                console.error('Error fetching class list:', error);
                toast.error('Error fetching class list');
            }
        })();
    }, []);

    const handleTakeExam = (exam: Exam) => {
        setSelectedExam(exam);
    };

    const canTakeExam = (exam: Exam): boolean => {
        // exam.date = "31-03-2025"
        // end_time = "10:00 PM"
        // start_time = "08:10 PM"
        const now = new Date().setHours(0, 0, 0, 0);
        const [day, month, year] = exam.date.split('-').map(Number);
        const examDate=new Date(`${month}-${day}-${year}`).getTime();
        if(now> examDate || now<examDate) return false;
        if(now=== examDate) {
                // start_time = "08:10 PM"
                // end_time = "10:00 PM"
                // check if current time is between start_time and end_time
                let [startHours, startMinutes] = exam.start_time.slice(0, 5).split(':').map(Number);
                const startPeriod = exam.start_time.slice(-2).toUpperCase(); // Get AM/PM
                if (startPeriod === 'PM' && startHours !== 12) startHours += 12;
                if (startPeriod === 'AM' && startHours === 12) startHours = 0; // Midnight adjustment

                let [endHours, endMinutes] = exam.end_time.slice(0, 5).split(':').map(Number);
                const endPeriod = exam.end_time.slice(-2).toUpperCase(); // Get AM/PM
                if (endPeriod === 'PM' && endHours !== 12) endHours += 12;
                if (endPeriod === 'AM' && endHours === 12) endHours = 0; // Midnight adjustment

                const dateNow = new Date();
                const nowHours = dateNow.getHours();
                const nowMinutes = dateNow.getMinutes();
                return ((nowHours > startHours || (nowHours === startHours && nowMinutes >= startMinutes)) && ((nowHours < endHours || (nowHours === endHours && nowMinutes <= endMinutes))));
        }
        return false;
    };

    const handleViewScore = (exam: Exam) => {
        const examResult = examResults?.find((result) => result.exam_id === exam.exam_id);
        setSelectedExamResult(examResult);
        setOpen(true);
    };

    return (
        <Card className={cn(cardBgColor, cardBorderColor, 'shadow-lg')}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className={cn('text-lg', textColor)}>
                        Exams
                    </CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                <Filter className="h-4 w-4" />
                                <span>
                                    {filterType === 'all'
                                        ? 'All Exams'
                                        : filterType === 'completed'
                                        ? 'Completed'
                                        : 'Pending'}
                                </span>
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
                            filteredExamsList.map((exam) => {
                                return(
                                <div
                                    key={exam.exam_id}
                                    className={cn(
                                        'p-3 rounded-md',
                                        exam.isCompleted
                                            ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800'
                                            : 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
                                        textColor,
                                        'border',
                                        'group hover:bg-accent/10 transition-colors duration-200',
                                        'flex justify-between items-center sm:flex-row'
                                    )}
                                >
                                    <div className="flex-grow">
                                        <div className="font-medium">
                                            {exam.title}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {exam.date} ({exam.start_time} - {exam.end_time})
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        {exam.isCompleted || examResults?.some((result) => result.exam_id === exam.exam_id) ? (
                                            <Dialog open={open} onOpenChange={setOpen}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="hover:bg-accent hover:text-accent-foreground bg-green-100 border-green-300 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300"
                                                        onClick={() => handleViewScore(exam)}
                                                    >
                                                        View Score
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-2xl font-bold text-center">Exam Result</DialogTitle>
                                                        <DialogDescription className="text-center text-lg font-medium text-gray-600 dark:text-gray-300">
                                                            {exam.title}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    {selectedExamResult ? (
                                                        <div className="space-y-6 py-4">
                                                            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-green-50 p-6 dark:from-blue-900/30 dark:to-green-900/30">
                                                                <div className="text-center mb-4">
                                                                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                                                        {selectedExamResult.percentage}%
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Overall Score</div>
                                                                </div>
                                                                
                                                                <div className="space-y-4">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-600 dark:text-gray-300">Marks Obtained</span>
                                                                        <span className="font-semibold text-green-600 dark:text-green-400">
                                                                            {selectedExamResult.total_marks_obtained}
                                                                        </span>
                                                                    </div>
                                                                    
                                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                        <div 
                                                                            className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                                                                            style={{ 
                                                                                width: `${(selectedExamResult.total_marks_obtained / selectedExamResult.total_possible_marks) * 100}%` 
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-600 dark:text-gray-300">Total Marks</span>
                                                                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                                            {selectedExamResult.total_possible_marks}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                                            No result found for this exam.
                                                        </div>
                                                    )}
                                                    <DialogFooter>
                                                        <Button 
                                                            onClick={() => setOpen(false)}
                                                            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90"
                                                        >
                                                            Close
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="hover:bg-accent hover:text-accent-foreground bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300"
                                                        onClick={() => handleTakeExam(exam)}
                                                    >
                                                        Take Exam
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-lg font-semibold">
                                                                        {exam.title}
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription asChild className="text-sm text-gray-500 dark:text-gray-400">
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                                <div>
                                                                                        <span className="font-medium">Date:</span> {exam.date}
                                                                                </div>
                                                                                <div>
                                                                                        <span className="font-medium">Time:</span> {exam.start_time} - {exam.end_time}
                                                                                </div>
                                                                                <div>
                                                                                        <span className="font-medium">Marks:</span> {exam.total_marks}
                                                                                </div>
                                                                                <div>
                                                                                        <span className="font-medium">Questions:</span> {exam.total_questions}
                                                                                </div>
                                                                        </div>
                                                                </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                        Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction disabled={!canTakeExam(exam)} className={cn(canTakeExam(exam) ? "bg-blue-500 hover:bg-blue-700 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed", "rounded-md px-4 py-2 font-medium")}>
                                                                        <Link href={`/student/exams/${exam.exam_id}`}>
                                                                        {canTakeExam(exam) ? "Take Exam" : "Not Available"}
                                                                        </Link>
                                                                </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </div>
                            )})
                        ) : (
                            <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                                <File
                                    className={`h-16 w-16 ${textColor} opacity-20 mb-4`}
                                />
                                <p className={`${textColor} font-medium`}>
                                    {searchQuery
                                        ? 'No exams match your search'
                                        : filterType === 'all'
                                        ? 'No exams scheduled'
                                        : filterType === 'completed'
                                        ? 'No completed exams'
                                        : 'No pending exams'}
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}