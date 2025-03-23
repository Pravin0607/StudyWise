import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Book, BrainCircuit } from 'lucide-react';

const ExamCreationOptionModal = ({ children }: { children: React.ReactNode }) => {

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Choose Exam Creation Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 text-sm sm:text-base py-2 sm:py-3 rounded-lg transition-all duration-300 ease-in-out"
                        asChild
                    >
                        <Link href={'create-exam-ai'} className="flex items-center justify-center gap-2">
                            <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span>AI Assisted</span>
                        </Link>
                    </Button>

                    <Button
                        className="w-full bg-gray-500 text-white hover:bg-gray-600"
                        asChild
                        >
                        <Link href={'create-exam'} >
                        <Book/> Manually
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ExamCreationOptionModal;