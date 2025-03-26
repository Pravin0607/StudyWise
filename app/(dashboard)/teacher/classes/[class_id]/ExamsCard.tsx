'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from "@/lib/utils";
import { File, PlusIcon, Pencil, Trash } from 'lucide-react';
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

interface Exam {
    id: number;
    title: string;
    type: string;
}

interface ExamsCardProps {
    exams: Exam[];
    textColor: string;
    cardBgColor: string;
    cardBorderColor: string;
    separatorColor: string;
    itemBgColor: string;
    itemBorderColor: string;
}

export function ExamsCard({
    exams,
    textColor,
    cardBgColor,
    cardBorderColor,
    separatorColor,
    itemBgColor,
    itemBorderColor
}: ExamsCardProps) {
    const handleDeleteExam = async (examId: number) => {
        // Implement delete logic here
        console.log(`Deleting exam with ID: ${examId}`);
    };

    return (
        <Card className={cn(cardBgColor, cardBorderColor, "shadow-lg")}>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle className={cn("text-lg", textColor)}>Exams</CardTitle>
                    <ExamCreationOptionModal>
                    <Button size={'sm'} variant="outline" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 border-purple-500/30 font-bold h-8 px-2 py-1 text-xs md:h-9 md:px-4 md:py-2 md:text-sm">
                        <span className="hidden sm:inline">Create Exam</span>
                        <span className="sm:hidden">Create</span>
                        <PlusIcon strokeWidth={3.5} className="h-4 w-4 ml-1"/>
                    </Button>
                    </ExamCreationOptionModal>
                </div>
                <Separator className={separatorColor} />
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    <div className="space-y-3 text-sm md:text-base">
                        {exams.length > 0 ? (
                            exams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className={cn(
                                        "p-3 rounded-md",
                                        itemBgColor,
                                        textColor,
                                        itemBorderColor,
                                        "hover:bg-gray-600/50 transition-colors duration-200",
                                        "flex justify-between items-center"
                                    )}
                                >
                                    <div className='flex gap-x-3 items-center cursor-pointer'>
                                        <File/> <span>{exam.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className='font-semibold mr-2 hidden sm:inline'>06-07-2025</span>
                                        <Link href={`/teacher/exams/${exam.id}/edit`}>
                                            <Button variant="outline" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/30">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
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
                                                    <AlertDialogAction onClick={() => handleDeleteExam(exam.id)}>
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
                                <p className={`${textColor} font-medium`}>No exams scheduled</p>
                                <p className={`${textColor} opacity-70 text-sm mt-1`}>Click 'Create Exam' to schedule assessments</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}