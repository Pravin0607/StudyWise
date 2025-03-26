import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { Endpoints } from '@/lib/apiEndpoints';
import useUserStore from '@/store/userStore';
import useClassStore from '@/store/useClassStore';

interface Student {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
}
const fetchStudentByQuery = async (query: string,token:string) => {
    try {
        const result = await axios.get(Endpoints.CLASS.GETSTUDENTSBYSEARCH, {
            params: {
                search: query
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return result.data?.students;
    } catch (e) {
        console.log(e);
        return [];
    }
}

const AddStudentModal = ({
    children,
    onStudentSelect,
    initialStudents
}: {
    children: React.ReactNode;
    onStudentSelect?: (student: Student) => void;
    initialStudents?: Student[];
}) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [availableStudents, setAvailableStudents] = useState<Student[]>(initialStudents || []);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const token=useUserStore(state=>state.user?.token);
    const studentDetails=useClassStore(state=>state.studentsDetails);

    const handleStudentSelect = useCallback((student: Student) => {
        setSelectedStudent(student); // Set the selected student
    }, []);

    const confirmSelection = async() => {
        if (selectedStudent && onStudentSelect) {            
            onStudentSelect(selectedStudent);
        }
        setSelectedStudent(null); // Reset the selected student
        setOpen(false); // Close the modal after confirmation
    };

    useEffect(() => {
        const fetchData = async () => {
            let students = await fetchStudentByQuery(searchQuery,token as string);
            // filter out students that are already in the class
            if(studentDetails)
                {
                students = students.filter((student:any) => !studentDetails.find(s => s.user_id === student.user_id));
            setAvailableStudents(students);
        };
    };

        fetchData();
    }, [searchQuery]);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Student</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className='flex items-center gap-x-2'>
                        <Input
                            placeholder='Search Student'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {availableStudents.length > 0 ? (
                        <ScrollArea className='h-72'>
                            <div className="space-y-2">
                                {availableStudents.map(student => (
                                    <div
                                        key={student.user_id}
                                        className="p-2 rounded-md cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleStudentSelect(student)}
                                    >
                                        <p className="font-bold">{student.first_name} {student.last_name}</p>
                                        <p className="font-semibold text-gray-500">{student.email}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <p className="text-gray-500">No students found.</p>
                    )}
                </div>
                {selectedStudent && (
                    <DialogFooter className='flex items-center justify-between md:flex-col'>

                        <p className="text-sm text-gray-700 order-1  mb-2">
                            Confirm selection of <span className="font-bold">{selectedStudent.first_name} {selectedStudent.last_name}</span>?
                        </p>

                        <div className="flex gap-2 md:order-1">
                            <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                                Cancel
                            </Button>
                            <Button onClick={confirmSelection} variant={'outline'} className='bg-green-300'>Confirm</Button>
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddStudentModal;