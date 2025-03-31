'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { PlusIcon, User, Trash, Search } from 'lucide-react';
import AddStudentModal from './AddStudentModal';
import useClassStore from '@/store/useClassStore';
import { useState } from 'react';
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

interface Student {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
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
        const selectedClass=useClassStore(state=>state.selectedClass);
        const addStudentToClass=useClassStore(state=>state.addStudent);
        const removeStudent=useClassStore(state=>state.removeStudent);
        const [searchQuery, setSearchQuery] = useState<string>('');

        // Filter students based on search query
        const filteredStudents = students.filter(student => {
            const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
            const email = student.email.toLowerCase();
            const query = searchQuery.toLowerCase();
            
            return fullName.includes(query) || email.includes(query);
        });

    return (
        <Card className={cn(cardBgColor, cardBorderColor, "shadow-lg")}>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle className={cn("text-lg", textColor)}>Students</CardTitle>
                    <AddStudentModal onStudentSelect={async(student)=>{await addStudentToClass(selectedClass?.class_id as string,student.user_id)}}>
                    <Button size={'sm'} variant="outline" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/30 flex items-center font-bold h-8 px-2 py-1 text-xs md:h-9 md:px-4 md:py-2 md:text-sm">
                        <span className="hidden sm:inline">Add Student</span>
                        <span className="sm:hidden">Add</span>
                        <PlusIcon strokeWidth={3.5} className="h-4 w-4 ml-1"/>
                    </Button>
                    </AddStudentModal>
                </div>
                <Separator className={separatorColor} />
                
                {/* Search input */}
                <div className="relative mt-2">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search students..."
                        className="pl-8 h-9"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    <div className="space-y-2 text-sm md:text-base">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <div
                                    key={student.user_id}
                                    className={cn(
                                        "p-3 rounded-md",
                                        itemBgColor,
                                        textColor,
                                        itemBorderColor,
                                        "hover:bg-gray-600/50 transition-colors duration-200 cursor-pointer",
                                        "flex items-center justify-between"
                                    )}
                                >
                                    <div className='flex items-center gap-x-3'>
                                        <User/><span>{student.first_name+" "+student.last_name}</span>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon" className="h-8 w-8">
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently remove <span className='font-bold'>{student.first_name+" "+student.last_name}</span> from this class.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={async()=>{
                                                    if(selectedClass?.class_id){
                                                        await removeStudent(selectedClass?.class_id,student.user_id);
                                                    }
                                                }}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                                <User className={`h-16 w-16 ${textColor} opacity-20 mb-4`} />
                                <p className={`${textColor} font-medium`}>
                                    {searchQuery 
                                        ? 'No students match your search' 
                                        : 'No students in this class yet'
                                    }
                                </p>
                                <p className={`${textColor} opacity-70 text-sm mt-1`}>
                                    {!searchQuery && "Click 'Add Student' to assign students to this class"}
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}