'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from "@/lib/utils";
import { File, PlusIcon } from 'lucide-react';
import ExamCreationOptionModal from './ExamCreationOptionModal';

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
    return (
        <Card className={cn(cardBgColor, cardBorderColor, "shadow-lg")}>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle className={cn("text-lg", textColor)}>Exams</CardTitle>
                    <ExamCreationOptionModal>
                    <Button size={'sm'} variant="outline" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 border-purple-500/30 font-bold md:h-9 md:px-4 md:py-2 md:text-sm">
                        Create Exam <PlusIcon strokeWidth={3.5}/>
                    </Button>
                    </ExamCreationOptionModal>
                </div>
                <Separator className={separatorColor} />
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    <div className="space-y-3 text-sm md:text-base">
                        {exams.map((exam) => (
                            <div
                                key={exam.id}
                                className={cn(
                                    "p-3 rounded-md",
                                    itemBgColor,
                                    textColor,
                                    itemBorderColor,
                                    "hover:bg-gray-600/50 transition-colors duration-200 cursor-pointer",
                                    "flex justify-between items-center"
                                )}
                            >
                                <div className='flex gap-x-3 items-center'><File/> <span>{exam.title}</span></div>
                                <div>
                                    <span className='font-semibold'>06-07-2025</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}