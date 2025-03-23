import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Student {
    id: string;
    name: string;
    email: string;
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
    const [availableStudents, setAvailableStudents] = useState<Student[]>(initialStudents || [
        { id: '1', name: 'Alice Smith', email: 'alice.smith@example.com' },
        { id: '2', name: 'Bob Johnson', email: 'bob.johnson@example.com' },
        { id: '3', name: 'Charlie Brown', email: 'charlie.brown@example.com' },
        { id: '4', name: 'Diana Miller', email: 'diana.miller@example.com' },
        { id: '5', name: 'Ethan Davis', email: 'ethan.davis@example.com' },
        { id: '6', name: 'Fiona Wilson', email: 'fiona.wilson@example.com' },
        { id: '7', name: 'George Martinez', email: 'george.martinez@example.com' },
        { id: '8', name: 'Hannah Anderson', email: 'hannah.anderson@example.com' },
        { id: '9', name: 'Isaac Taylor', email: 'isaac.taylor@example.com' },
        { id: '10', name: 'Jessica Thomas', email: 'jessica.thomas@example.com' },
    ]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const handleStudentSelect = useCallback((student: Student) => {
        setSelectedStudent(student); // Set the selected student
    }, []);

    const confirmSelection = () => {
        if (selectedStudent && onStudentSelect) {
            onStudentSelect(selectedStudent);
        }
        setOpen(false); // Close the modal after confirmation
    };

    const filteredStudents = availableStudents.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (initialStudents) {
            setAvailableStudents(initialStudents);
        }
    }, [initialStudents]);

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
                    {filteredStudents.length > 0 ? (
                        <ScrollArea className='h-72'>
                            <div className="space-y-2">
                                {filteredStudents.map(student => (
                                    <div
                                        key={student.id}
                                        className="p-2 rounded-md cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleStudentSelect(student)}
                                    >
                                        <p className="font-bold">{student.name}</p>
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
                    <DialogFooter className='flex items-center justify-between'>

                        <p className="text-sm text-gray-700 order-1 mb-2">
                            Confirm selection of <span className="font-bold">{selectedStudent.name}</span>?
                        </p>

                        <div className="flex gap-2">
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