'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from "@/lib/utils";
import { PlusIcon, User } from 'lucide-react';

interface Student {
    id: string;
    name: string;
}

interface StudentsCardProps {
    students: Student[];
    textColor: string;
    cardBgColor: string;
    cardBorderColor: string;
    separatorColor: string;
    itemBgColor: string;
    itemBorderColor: string;
}

export function StudentsCard({
    students,
    textColor,
    cardBgColor,
    cardBorderColor,
    separatorColor,
    itemBgColor,
    itemBorderColor
}: StudentsCardProps) {
    return (
        <Card className={cn(cardBgColor, cardBorderColor, "shadow-lg")}>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle className={cn("text-lg", textColor)}>Students</CardTitle>
                    <Button size={'sm'} variant="outline" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/30 flex items-center font-bold md:h-9 md:px-4 md:py-2 md:text-sm">
                        Add Student <PlusIcon strokeWidth={3.5}/>
                    </Button>
                </div>
                <Separator className={separatorColor} />
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    <div className="space-y-2 text-sm md:text-base">
                        {students.map((student) => (
                            <div
                                key={student.id}
                                className={cn(
                                    "p-3 rounded-md",
                                    itemBgColor,
                                    textColor,
                                    itemBorderColor,
                                    "hover:bg-gray-600/50 transition-colors duration-200 cursor-pointer",
                                    "flex items-center gap-x-3"
                                )}
                            >
                                <User/><span>{student.name}</span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}