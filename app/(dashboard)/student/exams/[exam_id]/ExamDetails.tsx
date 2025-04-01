import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import useStudentExamStore from "@/store/useStudentExamStore";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Exam {
    id: string;
    question: string;
    options: Array<string>;
    answer: string;
    marks: number;
}


function getMinutesBetweenTimes(start_time:string, end_time:string) {
    if (!start_time || !end_time) return 0;
    const [startHours, startMinutes] = start_time.split(":").map(Number);
    const [endHours, endMinutes] = end_time.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return endTotalMinutes - startTotalMinutes;
}

// Add a function to determine if the exam is available to start right now

// Add a function to get appropriate exam status message

const ExamPage: React.FC = () => {
    const {examsMetadata,setExamStartedTime,setExamEndedTime,submitExam,examQuestionsWithMetadata,updateAnswer,examDetails}=useStudentExamStore()
    const minutes=getMinutesBetweenTimes(examsMetadata?.start_time as string,examsMetadata?.end_time as string);
    const  router=useRouter();
    const [currentPage, setCurrentPage] = useState<"instructions" | "exam">(
        "instructions"
    );
    const canStartExam = () => {
      if (!examsMetadata) return false;
      
      const now = new Date();
      const examDate = new Date(examsMetadata.date);
      
      // Check if dates match (same day)
      const datesMatch = 
        now.getFullYear() === examDate.getFullYear() &&
        now.getMonth() === examDate.getMonth() &&
        now.getDate() === examDate.getDate();
      
      if (!datesMatch) return false;
      
      // Parse exam times
      const [startHours, startMinutes] = examsMetadata.start_time.split(':').map(Number);
      const [endHours, endMinutes] = examsMetadata.end_time.split(':').map(Number);
      
      // Create Date objects for start and end times
      const examStartTime = new Date(examDate);
      examStartTime.setHours(startHours, startMinutes, 0);
      
      const examEndTime = new Date(examDate);
      examEndTime.setHours(endHours, endMinutes, 0);
      
      // Return true if current time is between start and end time
      return now >= examStartTime && now <= examEndTime;
    };
    const getExamStatusMessage = () => {
      if (!examsMetadata) return "Loading exam details...";
      
      const now = new Date();
      const examDate = new Date(examsMetadata.date);
      
      // Parse exam times
      const [startHours, startMinutes] = examsMetadata.start_time.split(':').map(Number);
      const [endHours, endMinutes] = examsMetadata.end_time.split(':').map(Number);
      
      // Create Date objects for start and end times
      const examStartTime = new Date(examDate);
      examStartTime.setHours(startHours, startMinutes, 0);
      
      const examEndTime = new Date(examDate);
      examEndTime.setHours(endHours, endMinutes, 0);
      
      if (now < examStartTime) {
        // Format the date and time nicely
        const dateOptions: Intl.DateTimeFormatOptions = { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        };
        const formattedDate = examDate.toLocaleDateString('en-US', dateOptions);
        return `Exam will be available on ${formattedDate} at ${examsMetadata.start_time}`;
      } else if (now > examEndTime) {
        return "Exam period has ended";
      } else {
        return "Ready to start"; // Exam is available now
      }
    };
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{
        [key: string]: string | null;
    }>({});
    const [questionStatus, setQuestionStatus] = useState<{
        [key: string]: string;
    }>({});
    const [showModal, setShowModal] = useState(false);
    // Replace the existing timeLeft state
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
    const [examStarted, setExamStarted] = useState(false);
    const [showQuestionPalette, setShowQuestionPalette] = useState(true);
    const [isExamFinished, setIsExamFinished] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [open, setOpen] = React.useState(true)

    // const currentQuestion = sampleQuestions[currentQuestionIndex];
    const currentQuestion = examQuestionsWithMetadata?.questions[currentQuestionIndex];
    function calculateTimeLeft ()  {
        if (!examsMetadata?.end_time) return 3600; // Fallback to 1 hour
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Parse end time (assuming format is "HH:MM")
        const [endHours, endMinutes] = examsMetadata.end_time.split(':').map(Number);
        
        // Create end time date object
        const endTime = new Date(today);
        endTime.setHours(endHours, endMinutes, 0);
        
        // Calculate seconds between now and end time
        const diffSeconds = Math.floor((endTime.getTime() - now.getTime()) / 1000);
        
        // Return positive value or zero if already past
        return Math.max(0, diffSeconds);
    };
    

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust 768px as needed
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);
        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        
        if (examStarted) {
          // Initial calculation
          setTimeLeft(calculateTimeLeft());
          
          // Set up interval
          timer = setInterval(() => {
            setTimeLeft(prev => {
              // Auto-submit when timer reaches zero
              if (prev <= 1) {
                clearInterval(timer);
                if (!isExamFinished) {
                  // Auto-submit logic
                  setIsExamFinished(true);
                  setShowQuestionPalette(false);
                  setExamEndedTime();
                  submitExam();
                }
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
        
        return () => clearInterval(timer);
      }, [examStarted, examsMetadata?.end_time,isExamFinished]);

      useEffect(() => {
        // Check if exam metadata is available
        if (examsMetadata) {
            const now = new Date();
            const examDate = new Date(examsMetadata.date);
            
            // Set today's date with the exam's start and end times for comparison
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            // Parse exam times
            const [startHours, startMinutes] = examsMetadata.start_time.split(':').map(Number);
            const [endHours, endMinutes] = examsMetadata.end_time.split(':').map(Number);
            
            // Create Date objects for start and end times
            const examStartTime = new Date(examDate);
            examStartTime.setHours(startHours, startMinutes, 0);
            
            const examEndTime = new Date(examDate);
            examEndTime.setHours(endHours, endMinutes, 0);
            
            // Compare current time to exam schedule
            if (now < examStartTime) {
                // Exam hasn't started yet
                toast.error(`This exam will be available on ${examDate.toDateString()} at ${examsMetadata.start_time}`);
                router.back();
            } else if (now > examEndTime) {
                // Exam has already ended
                toast.error("This exam has already ended");
                router.back();
            }
            // If now is between start and end time, allow access to exam
        }
    }, [examsMetadata, router]);
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
          return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
        } else {
          return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
        }
      };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < (examQuestionsWithMetadata?.questions?.length as number) - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleAnswerSelect = (option: string, index: number) => {
        // Update answer in the store
        updateAnswer(currentQuestionIndex, String(index));
        
        // Also update the local questionStatus state to show in palette
        setQuestionStatus((prev) => ({
            ...prev,
            [currentQuestion?.question as string]: "attempted",
        }));
        
        // Update selectedAnswers for the submission dialog counter
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQuestion?._id as string]: String(index),
        }));
    };

    const handleMarkForReview = () => {
        setQuestionStatus((prev) => ({
            ...prev,
            [currentQuestion?.question as string]: "review",
        }));
    };

    const handleSubmitExam = () => {
        setShowModal(true);
        
    };
    
    const confirmSubmitExam = () => {
        setIsExamFinished(true);
        setShowModal(false);
        setShowQuestionPalette(false);
        setExamEndedTime();
        setExamEndedTime();
        submitExam();
    };

    const renderExamContent = () => {
        if (!examQuestionsWithMetadata) {
            return <div>Loading questions...</div>;
        }
        if (isExamFinished) {
            return (
                <div className="flex-1 p-2 mt-6 flex justify-center">
                    <div className="text-center space-y-4">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-semibold">
                            Exam Finished
                        </h2>
                        <p className="text-gray-700">
                            Thank you for completing the exam.
                        </p>
                        {examsMetadata?.total_marks && examDetails?.exam_statistics ? (
                            <div className=" bg-white p-4 rounded-xl shadow-lg border border-blue-100">
                                <h3 className="text-2xl font-bold text-blue-800 mb-2">Your Results</h3>
                                <div className="space-y-4 w-[50%] mx-auto">
                                    <div className="flex flex-col items-center">
                                        <div className="text-4xl font-bold text-blue-600">
                                            {examDetails?.exam_statistics.total_marks_obtained}
                                            <span className="text-gray-400 text-2xl">/{examsMetadata?.total_marks}</span>
                                        </div>
                                        <p className="text-gray-600 mt-1">Total Marks</p>
                                    </div>
                                    
                                    <div className="flex justify-center mt-4">
                                        <div className="relative h-32 w-32">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-3xl font-bold text-green-600">
                                                    {examDetails?.exam_statistics.percentage}%
                                                </div>
                                            </div>
                                            <svg className="transform -rotate-90" viewBox="0 0 100 100">
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke="#e6e6e6"
                                                    strokeWidth="10"
                                                />
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke={examDetails?.exam_statistics.percentage >= 35 ? "#22c55e" : "#ef4444"}
                                                    strokeWidth="10"
                                                    strokeDasharray={`${examDetails?.exam_statistics.percentage * 2.83} 283`}
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* <div className="text-center mt-4">
                                        <span className={`inline-block px-4 py-2 rounded-full ${
                                            examDetails?.exam_statistics.percentage >= 60 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                            {examDetails?.exam_statistics.percentage >= 60 ? 'Passed!' : 'Better luck next time!'}
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                                <div className="animate-pulse flex flex-col items-center">
                                    <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
                                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        )}
                        <Link href={'/student/dashboard'} className="mt-4 block">
                        <Button>Go To DashBoard</Button>
                        </Link>
                        {/* Show Results or a Summary Here */}
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full sm:w-4/5 p-4">
                <h3 className="text-base font-semibold mb-2 flex justify-between items-center">
                    <span className="text-sm font-normal text-gray-500">
                        Question {currentQuestionIndex + 1} of{" "}
                        {examQuestionsWithMetadata?.questions?.length}
                    </span>
                    <span>Marks: {currentQuestion?.marks}</span>
                </h3>
                <h3 className="text-base font-semibold mb-2">
                    {currentQuestion?.question}
                </h3>
                <div className="space-y-3 mb-6">
                    {currentQuestion?.choices?.map((option, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-center border rounded-md p-3 cursor-pointer transition-all",
                                currentQuestion?.userAnswer === String(index)
                                    ? "bg-blue-50 border-blue-400 shadow-sm"
                                    : "bg-white hover:bg-gray-50 border-gray-200"
                            )}
                            onClick={() => handleAnswerSelect(option, index)}
                        >
                            <div className="flex items-center justify-center">
                                <div
                                    className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3",
                                        currentQuestion?.userAnswer === String(index)
                                            ? "border-blue-500"
                                            : "border-gray-400"
                                    )}
                                >
                                    {currentQuestion?.userAnswer === String(index) && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                    )}
                                </div>
                                <span className="text-sm font-medium">{option}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center space-x-4 sm:space-x-8 flex-wrap gap-4">
                    <Button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        <ArrowLeft className="mr-2" /> Previous
                    </Button>
                    {currentQuestionIndex < (examQuestionsWithMetadata?.questions?.length as number) - 1 && (
                        <Button
                            onClick={handleNextQuestion}
                            disabled={
                                currentQuestionIndex ===
                                (examQuestionsWithMetadata?.questions?.length as number) - 1
                            }
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Next <ArrowRight className="ml-2" />
                        </Button>
                    )}
                    {currentQuestionIndex === (examQuestionsWithMetadata?.questions?.length as number) - 1 && (
                        <Button
                            onClick={handleSubmitExam}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Submit
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    useEffect(() => {
        // Disable back button
        const preventBack = () => {
            window.history.pushState(null, document.title, window.location.pathname);
        };

        window.history.pushState(null, document.title, window.location.pathname);
        window.addEventListener('popstate', preventBack);

        // Disable tab switching (basic approach - can be bypassed)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                // You can add logic here to pause the exam or show a warning
                alert('Tab switch detected. Please stay focused on the exam.');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Disable refresh
        const preventRefresh = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = 'Are you sure you want to refresh the page? This will end the exam.';
            return 'Are you sure you want to refresh the page? This will end the exam.'; // For some browsers
        };

        window.addEventListener('beforeunload', preventRefresh);

        return () => {
            window.removeEventListener('popstate', preventBack);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', preventRefresh);
        };
    }, [isExamFinished]);

    return (
        <div className="h-screen flex flex-col">
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl text-blue-700 flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-yellow-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            Important Exam Rules
                        </AlertDialogTitle>
                        <AlertDialogDescription
                            className="space-y-4 mt-4"
                            asChild
                        >
                            <div>
                                <p className="text-gray-700 font-medium">
                                    Please note the following strict exam rules:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-red-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        Do NOT refresh the page.
                                    </li>
                                    <li className="flex items-center gap-2 text-red-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        Do NOT switch tabs or windows.
                                    </li>
                                    <li className="flex items-center gap-2 text-red-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        Do NOT close the browser.
                                    </li>
                                </ul>
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
                                    <p className="font-bold text-red-700">
                                        Any violation of these rules will result
                                        in automatic exam submission.
                                    </p>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => setOpen(false)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                        >
                            I Understand
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex justify-between flex-col md:flex-row p-4 border-b bg-gray-100 flex-wrap gap-4 items-center">
                <h2 className="text-lg font-bold">Exam Name</h2>
                {(examStarted && !isExamFinished) && (
  <div className="flex items-center gap-2">
    <div className={`font-semibold text-lg ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
      Time Left: {formatTime(timeLeft)}
    </div>
    {timeLeft < 300 && (
      <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
        Less than 5 minutes!
      </span>
    )}
  </div>
)}
                <Button
                    variant="outline"
                    onClick={() => setShowInstructions(true)}
                    className="md:ml-4"
                >
                    View Instructions
                </Button>
            </div>
            {currentPage === "instructions" ? (
                <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white border rounded-lg shadow-lg mt-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        {examsMetadata?.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-semibold text-gray-700">
                                    {new Date(
                                        examsMetadata?.date as string
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Duration
                                </p>
                                <p className="font-semibold text-gray-700">
                                    {minutes} minutes (
                                    {examsMetadata?.start_time} -{" "}
                                    {examsMetadata?.end_time})
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-purple-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Questions
                                </p>
                                <p className="font-semibold text-gray-700">
                                    {examsMetadata?.total_questions}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-yellow-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Marks
                                </p>
                                <p className="font-semibold text-gray-700">
                                    {examsMetadata?.total_marks}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
  {!canStartExam() && (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {getExamStatusMessage()}
          </p>
        </div>
      </div>
    </div>
  )}
  <Button
    onClick={() => {
      setCurrentPage("exam");
      setExamStarted(true);
      setExamStartedTime();
    }}
    className="w-full"
    disabled={!canStartExam()}
  >
    {canStartExam() ? "Start Exam" : "Exam Not Available"}
  </Button>
</div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row h-full">
                    {showQuestionPalette && !isMobile && (
                        <div className="w-full sm:w-1/5 p-4 border-r bg-gray-200 flex flex-col">
                            <h3 className="text-md font-bold mb-2">
                                Question Palette
                            </h3>
                            <div className="grid grid-cols-4 gap-2">
                                {examQuestionsWithMetadata?.questions?.map(
                                    (question, index) => (
                                        <Button
                                            key={question._id}
                                            variant="outline"
                                            className={cn("w-full text-black", {
                                                "bg-blue-600 text-white":
                                                    currentQuestionIndex ===
                                                    index,
                                                "bg-yellow-500":
                                                    questionStatus[
                                                        question.question
                                                    ] === "review",
                                                "bg-green-500":
                                                    questionStatus[
                                                        question.question
                                                    ] === "attempted",
                                            })}
                                            onClick={() =>
                                                setCurrentQuestionIndex(index)
                                            }
                                        >
                                            {index + 1}
                                        </Button>
                                    )
                                )}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-300 text-sm space-y-2">
                                <p className="flex items-center gap-2">
                                    <span className="bg-green-500 text-white px-2 py-1 rounded"></span>
                                    Answered
                                </p>
                                {/* <p className="flex items-center gap-2">
                                    <span className="bg-yellow-500 text-white px-2 py-1 rounded"></span>
                                    Marked for Review
                                </p> */}
                                <p className="flex items-center gap-2">
                                    <span className="bg-white border-gray-300 border px-2 py-1 rounded"></span>
                                    Not Visited
                                </p>
                            </div>
                        </div>
                    )}
                    {renderExamContent()}
                </div>
            )}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="flex justify-center text-center flex-col bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="flex justify-center text-center text-xl font-semibold text-gray-800">
                            Confirm Submission
                        </DialogTitle>
                        <DialogDescription
                            asChild
                            className="flex flex-col justify-center space-y-2 text-center text-gray-600 mt-2"
                        >
                            <div>
                                <div>
                                    You have attempted{" "}
                                    <span className="font-semibold text-blue-500">
                                        {Object.keys(selectedAnswers).length}
                                    </span>{" "}
                                    /{" "}
                                    <span className="font-semibold text-green-500">
                                        {
                                            examQuestionsWithMetadata?.questions
                                                ?.length
                                        }
                                    </span>{" "}
                                    questions.
                                </div>
                                Are you sure you want to submit the exam? <br />
                                <span className="text-red-500 font-semibold">
                                    Note: You cannot change your answers after
                                    submission.
                                </span>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <div className="flex space-x-3 items-center w-full justify-center">
                            <Button
                                variant="outline"
                                onClick={() => setShowModal(false)}
                                className="text-gray-700 hover:bg-gray-100 border-gray-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmSubmitExam}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            >
                                Confirm Submit
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {showQuestionPalette &&
                isMobile &&
                currentPage !== "instructions" && (
                    <div className="w-full sm:w-1/5 p-4 border-r bg-gray-200 flex flex-col">
                        <h3 className="text-md font-bold mb-2">
                            Question Palette
                        </h3>
                        <div className="grid grid-cols-5 gap-2">
                            {examQuestionsWithMetadata?.questions?.map(
                                (question, index) => (
                                    <Button
                                        key={question._id}
                                        variant="outline"
                                        className={cn("w-full text-black", {
                                            "bg-blue-600 text-white":
                                                currentQuestionIndex === index,
                                            "bg-yellow-500":
                                                questionStatus[
                                                    question.question
                                                ] === "review",
                                            "bg-green-500":
                                                questionStatus[
                                                    question.question
                                                ] === "attempted",
                                        })}
                                        onClick={() =>
                                            setCurrentQuestionIndex(index)
                                        }
                                    >
                                        {index + 1}
                                    </Button>
                                )
                            )}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-300 text-sm space-y-2">
                            <p className="flex items-center gap-2">
                                <span className="bg-blue-600 text-white px-2 py-1 rounded"></span>
                                Answered
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="bg-yellow-500 text-white px-2 py-1 rounded"></span>
                                Marked for Review
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="bg-white border-gray-300 border px-2 py-1 rounded"></span>
                                Not Visited
                            </p>
                        </div>
                    </div>
                )}
            <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Exam Instructions</DialogTitle>
                    </DialogHeader>
                    <div className="text-gray-700 space-y-4">
                        <p>
                            Welcome to the Exam! Please read the following
                            instructions carefully before starting the exam.
                        </p>
                        <h3 className="font-semibold text-lg">
                            General Instructions:
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                This exam consists of{" "}
                                {examQuestionsWithMetadata?.questions?.length}{" "}
                                multiple-choice questions.
                            </li>
                            <li>
                                The exam duration is 60 minutes. The timer will
                                start once you click &quot;Start Exam&quot;.
                            </li>
                            <li>Each question has a specific mark value.</li>
                            <li>
                                Select the best possible answer for each
                                question. You can change your answer before
                                submitting.
                            </li>
                            <li>
                                You can mark questions for review using the
                                &quot;Mark for Review&quot; button.
                            </li>
                            <li>
                                You can navigate between questions using the
                                &quot;Previous&quot; and &quot;Next&quot;
                                buttons.
                            </li>
                        </ul>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowInstructions(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExamPage