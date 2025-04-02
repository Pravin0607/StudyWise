'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import useUserStore from '@/store/userStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Endpoints } from '@/lib/apiEndpoints';

interface ExamScore {
    studentId: string;
    totalMarksObtained: number;
    totalPossibleMarks: number;
    studentName: string;
    email: string;
}

interface ExamDetails {
    _id: string;
    class_id: string;
    total_marks: number;
    title: string;
    questions: any[];
    results: {
        studentId: string;
        totalMarksObtained: number;
        totalPossibleMarks: number;
        _id: string;
    }[];
    studentsTaken: string[];
    total_questions: number;
}

interface ResultData {
    exam_scores: ExamScore[];
    exam_details: ExamDetails;
    total_students: number;
    message?: string;
}

const ShowResultModal = ({exam_id}:{exam_id:string}) => {
    const token=useUserStore(state=>state.user.token);
    // const router=useRouter();
    // In a real app, you would fetch this data from an API
    const [data, setData] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Mock API call - in a real app, fetch data from your API
        // Simulating the "no students" scenario - you can comment this out to see the normal data
        (async()=>{
            try{
                const response=await axios.get(Endpoints.EXAM.EXAMSCOREBYID.replace(":examId", exam_id),{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status===200){
                    setData(response?.data);
                }

            }catch(err){
                console.error("Error fetching exam results:", err);
            }
        })();
        // setData({
        //     "message": "No students have taken the exam",
        //     "exam_scores": [],
        //     "exam_details": {
        //         "studentsTaken": [],
        //         "_id": "67eaaacb04dc54b279e152ac",
        //         "class_id": "0195d083-9bb5-7000-b811-c5bff95b1b9e",
        //         "total_marks": 10,
        //         "questions": [],
        //         "title": "Test Exam - No Attempts",
        //         "results": [],
        //         "total_questions": 5
        //     },
        //     "total_students": 1
        // });
        
        // To see normal data, uncomment this block
        /*
        setData({
            "exam_scores": [
                // ...existing code...
            ],
            "exam_details": {
                // ...existing code...
            },
            "total_students": 2
        });
        */
        
        setLoading(false);
    }, []);

    // Calculate statistics for the chart
    const prepareChartData = () => {
        if (!data || data.exam_scores.length === 0) return [];
        
        // Create data for chart
        const chartData = data.exam_scores.map(score => ({
            name: score.studentName,
            marks: score.totalMarksObtained,
            possible: score.totalPossibleMarks
        }));

        // Add an aggregate bar for overall performance
        if (data.exam_scores.length > 0) {
            const avgMarks = data.exam_scores.reduce((sum, score) => sum + score.totalMarksObtained, 0) / data.exam_scores.length;
            chartData.push({
                name: 'Class Average',
                marks: parseFloat(avgMarks.toFixed(2)),
                possible: data.exam_details.total_marks
            });
        }

        return chartData;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading results...</div>;
    }

    if (!data) {
        return <div className="text-center text-red-500">Failed to load exam results</div>;
    }

    const chartData = prepareChartData();
    const attendanceRate = data.total_students > 0 
        ? (data.exam_details.studentsTaken.length / data.total_students) * 100 
        : 0;
    const hasAttempts = data.exam_scores && data.exam_scores.length > 0;

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h2 className="text-2xl font-bold">Exam Result : {data.exam_details.title} </h2>
            
            {!hasAttempts && (
                <Alert >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Attempts</AlertTitle>
                    <AlertDescription>
                        No students have attempted this exam yet. Results will appear here once students complete the exam.
                    </AlertDescription>
                </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.total_students}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.exam_details.studentsTaken.length} students took the exam
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">
                            Of total enrolled students
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {hasAttempts 
                                ? (data.exam_scores.reduce((sum, score) => sum + score.totalMarksObtained, 0) / data.exam_scores.length).toFixed(1)
                                : "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Out of {data.exam_details.total_marks} marks
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasAttempts ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="marks" name="Marks Obtained" fill="#8884d8" />
                                        {/* <Bar dataKey="possible" name="Possible Marks" fill="#82ca9d" /> */}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <ScrollArea className="h-80">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead className="text-right">Marks Obtained</TableHead>
                                            <TableHead className="text-right">Total Marks</TableHead>
                                            <TableHead className="text-right">Percentage</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.exam_scores.map((score) => (
                                            <TableRow key={score.studentId}>
                                                <TableCell className="font-medium">{score.studentName}</TableCell>
                                                <TableCell>{score.email}</TableCell>
                                                <TableCell className="text-right">{score.totalMarksObtained}</TableCell>
                                                <TableCell className="text-right">{score.totalPossibleMarks}</TableCell>
                                                <TableCell className="text-right">
                                                    {((score.totalMarksObtained / score.totalPossibleMarks) * 100).toFixed(1)}%
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-muted-foreground">No exam results available to display</p>
                            <p className="text-sm text-muted-foreground mt-2">Results will appear here once students complete the exam</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ShowResultModal;