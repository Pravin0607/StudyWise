"use client";
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

interface Exam {
    id: string;
    question: string;
    options: Array<string>;
    answer: string;
    marks: number;
}

const sampleQuestions: Exam[] = [
    {
        id: "1",
        question: "What is the capital of India?",
        options: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"],
        answer: "Delhi",
        marks: 5,
    },
    {
        id: "2",
        question: "What is the capital of the USA?",
        options: ["New York", "Washington DC", "Los Angeles", "Chicago"],
        answer: "Washington DC",
        marks: 5,
    },
    {
        id: "3",
        question: "What is the capital of the UK?",
        options: ["London", "Manchester", "Birmingham", "Liverpool"],
        answer: "London",
        marks: 5,
    },
    {
        id: "4",
        question: "What is the capital of Japan?",
        options: ["Kyoto", "Osaka", "Tokyo", "Yokohama"],
        answer: "Tokyo",
        marks: 5,
    },
    {
        id: "5",
        question: "What is the capital of France?",
        options: ["Marseille", "Lyon", "Paris", "Nice"],
        answer: "Paris",
        marks: 5,
    },
    {
        id: "6",
        question: "What is the capital of Germany?",
        options: ["Munich", "Hamburg", "Berlin", "Frankfurt"],
        answer: "Berlin",
        marks: 5,
    },
    {
        id: "7",
        question: "What is the capital of China?",
        options: ["Shanghai", "Hong Kong", "Beijing", "Guangzhou"],
        answer: "Beijing",
        marks: 5,
    },
    {
        id: "8",
        question: "What is the capital of Brazil?",
        options: ["Rio de Janeiro", "Sao Paulo", "Bras\u00edlia", "Salvador"],
        answer: "Bras\u00edlia",
        marks: 5,
    },
    {
        id: "9",
        question: "What is the capital of Russia?",
        options: ["Saint Petersburg", "Novosibirsk", "Moscow", "Yekaterinburg"],
        answer: "Moscow",
        marks: 5,
    },
    {
        id: "10",
        question: "What is the capital of South Africa?",
        options: ["Cape Town", "Johannesburg", "Pretoria", "Durban"],
        answer: "Pretoria",
        marks: 5,
    },
];

const ExamPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<"instructions" | "exam">(
        "instructions"
    );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{
        [key: string]: string | null;
    }>({});
    const [questionStatus, setQuestionStatus] = useState<{
        [key: string]: string;
    }>({});
    const [showModal, setShowModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3600);
    const [examStarted, setExamStarted] = useState(false);
    const [showQuestionPalette, setShowQuestionPalette] = useState(true);
    const [isExamFinished, setIsExamFinished] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    const currentQuestion = sampleQuestions[currentQuestionIndex];

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (examStarted) {
            timer = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [examStarted]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < sampleQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleAnswerSelect = (option: string) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: option,
        }));
        setQuestionStatus((prev) => ({
            ...prev,
            [currentQuestion.id]: "attempted",
        }));
    };

    const handleMarkForReview = () => {
        setQuestionStatus((prev) => ({
            ...prev,
            [currentQuestion.id]: "review",
        }));
    };

    const handleSubmitExam = () => {
        setShowModal(true);
    };

    const confirmSubmitExam = () => {
        setIsExamFinished(true);
        setShowModal(false);
        setShowQuestionPalette(false);
        alert("Exam Submitted! (Placeholder)");
    };

    const renderExamContent = () => {
        if (isExamFinished) {
            return (
                <div className="flex-1 p-6 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-semibold">
                            Exam Finished
                        </h2>
                        <p className="text-gray-700">
                            Thank you for completing the exam.
                        </p>
                        {/* Show Results or a Summary Here */}
                    </div>
                </div>
            );
        }

        return (
            <div className="w-4/5 p-4">
                <h3 className="text-base font-semibold mb-2 flex justify-between items-center">
                    <span className="text-sm font-normal text-gray-500">
                        Question {currentQuestionIndex + 1} of{" "}
                        {sampleQuestions.length}
                    </span>
                    <span>Marks: {currentQuestion.marks}</span>
                </h3>
                <h3 className="text-base font-semibold mb-2">
                    {currentQuestion.question}
                </h3>
                <div className="space-y-1 mb-4">
                    {currentQuestion.options.map((option, index) => (
                        <div
                            key={index}
                            className="flex items-center border rounded-md p-2 cursor-pointer bg-gray-100 hover:bg-gray-200"
                            onClick={() => handleAnswerSelect(option)}
                        >
                            <div
                                className={cn(
                                    "w-4 h-4 rounded-full border mr-2",
                                    selectedAnswers[currentQuestion.id] ===
                                        option
                                        ? "bg-primary border-primary"
                                        : "border-gray-300"
                                )}
                            />
                            <span className="text-sm">{option}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center space-x-8">
                    <Button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        <ArrowLeft className="mr-2" /> Previous
                    </Button>
                    <Button
                        onClick={handleMarkForReview}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Review Later
                    </Button>
                    {currentQuestionIndex < sampleQuestions.length - 1 && (
                        <Button
                            onClick={handleNextQuestion}
                            disabled={
                                currentQuestionIndex ===
                                sampleQuestions.length - 1
                            }
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Next <ArrowRight className="ml-2" />
                        </Button>
                    )}
                    {currentQuestionIndex === sampleQuestions.length - 1 && (
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

    return (
        <div className="h-screen flex flex-col">
            <div className="flex justify-between p-4 border-b bg-gray-100">
                <h2 className="text-lg font-bold">Exam Name</h2>
                {examStarted && (
                    <div className="flex items-center gap-4">
                        <span className="font-semibold">
                            Time Left: {formatTime(timeLeft)}
                        </span>
                    </div>
                )}
                <Button
                    variant="outline"
                    onClick={() => setShowInstructions(true)}
                    className="ml-4"
                >
                    View Instructions
                </Button>
            </div>
            {currentPage === "instructions" ? (
                <div className="max-w-4xl mx-auto p-6 border rounded-md shadow-md mt-4">
                    <h2 className="text-xl font-bold mb-4">Exam Details</h2>
                    <p className="text-sm text-gray-600 mb-2">
                        Exam Duration: 1 Hour
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        Total Questions: {sampleQuestions.length}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        Each question carries different marks.
                    </p>
                    <Button
                        onClick={() => {
                            setCurrentPage("exam");
                            setExamStarted(true);
                        }}
                        className="w-full mt-4"
                    >
                        Start Exam
                    </Button>
                </div>
            ) : (
                <div className="flex h-full">
                    {showQuestionPalette && (
                        <div className="w-1/5 p-4 border-r bg-gray-200 flex flex-col">
                            <h3 className="text-md font-bold mb-2">
                                Question Palette
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {sampleQuestions.map((question, index) => (
                                    <Button
                                        key={question.id}
                                        variant="outline"
                                        className={cn("w-full text-black", {
                                            "bg-blue-600 text-white":
                                                currentQuestionIndex === index,
                                            "bg-yellow-500":
                                                questionStatus[question.id] ===
                                                "review",
                                            "bg-green-500":
                                                questionStatus[question.id] ===
                                                "attempted",
                                        })}
                                        onClick={() =>
                                            setCurrentQuestionIndex(index)
                                        }
                                    >
                                        {index + 1}
                                    </Button>
                                ))}
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
                    {renderExamContent()}
                </div>
            )}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="flex justify-center text-center flex-col bg-white rounded-lg shadow-md p-6">
                    <DialogHeader>
                        <DialogTitle className="flex justify-center text-center text-xl font-semibold text-gray-800">
                            Confirm Submission
                        </DialogTitle>
                        <DialogDescription className="flex flex-col justify-center space-y-2 text-center text-gray-600 mt-2">
                            <div>
                                You have attempted{" "}
                                <span className="font-semibold text-blue-500">
                                    {Object.keys(selectedAnswers).length}
                                </span>{" "}
                                /{" "}
                                <span className="font-semibold text-green-500">
                                    {sampleQuestions.length}
                                </span>{" "}
                                questions.
                            </div>
                            Are you sure you want to submit the exam? <br />
                            <span className="text-red-500 font-semibold">
                                Note: You cannot change your answers after
                                submission.
                            </span>
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
                                This exam consists of {sampleQuestions.length}{" "}
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

export default ExamPage;
