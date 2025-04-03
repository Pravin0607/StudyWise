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
                    <div className="relative">
                        <Button
                            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700"
                            asChild
                        >
                            <Link href={'create-exam-ai'}>
                                <div className="flex items-center justify-center gap-2">
                                    <BrainCircuit className="w-5 h-5" />
                                    <span>AI Assisted</span>
                                </div>
                            </Link>
                        </Button>
                    </div>

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