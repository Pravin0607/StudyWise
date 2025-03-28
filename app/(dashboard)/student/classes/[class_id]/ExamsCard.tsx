'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from "@/lib/utils";
import { File, PlusIcon, Pencil, Trash } from 'lucide-react';

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
                <div className="flex justify-between items-center">
                    <CardTitle className={cn("text-lg", textColor)}>
                        Exams
                    </CardTitle>
                </div>
                <Separator className={separatorColor} />
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    <div className="space-y-3 text-sm md:text-base">
                        {exams.length > 10 ? (
                            exams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className={cn(
                                        "p-3 rounded-md",
                                        itemBgColor,
                                        textColor,
                                        itemBorderColor,
                                        "group hover:bg-accent/10 transition-colors duration-200",
                                        "flex justify-between items-center"
                                    )}
                                >
                                    <div className="flex gap-x-3 items-center cursor-pointer">
                                        <File className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                        <span className="group-hover:text-accent-foreground transition-colors">
                                            {exam.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold mr-2 hidden sm:inline">
                                            06-07-2025
                                        </span>
                                        <Button
                                            variant="outline"
                                            className="hover:bg-accent hover:text-accent-foreground"
                                        >
                                            Take Exam
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                                <File
                                    className={`h-16 w-16 ${textColor} opacity-20 mb-4`}
                                />
                                <p className={`${textColor} font-medium`}>
                                    No exams scheduled
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}