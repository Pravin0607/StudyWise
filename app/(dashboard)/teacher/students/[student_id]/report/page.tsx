'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, Clock, UserRound, AtSign, Phone, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Endpoints } from "@/lib/apiEndpoints";
import useUserStore from "@/store/userStore";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell,
    Legend, 
    Tooltip as RechartsTooltip
} from "recharts";

interface StudentInfo {
    student_id: string;
    name: string;
    email: string;
    mobile: string;
}

interface Class {
    class_id: string;
    class_name: string;
}

interface Exam {
    exam_id: string;
    exam_title: string;
    class_id: string;
    class_name: string;
    date: string;
    start_time: string;
    end_time: string;
    total_marks: number;
    total_marks_obtained: number;
    total_possible_marks: number;
    percentage: number;
}

interface PerformanceSummary {
    average_score: string;
    total_exams_taken: number;
    total_marks_obtained: number;
    total_possible_marks: number;
}

interface StudentReportData {
    student_info: StudentInfo;
    classes: Class[];
    exams: Exam[];
    exam_count: number;
    performance_summary: PerformanceSummary;
    success: boolean;
    message: string;
}

const StudentReport = () => {
    const params = useParams();
    const studentId = params.student_id as string;
    const [report, setReport] = useState<StudentReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = useUserStore(state => state.user.token);
    
    useEffect(() => {
        const fetchStudentReport = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(Endpoints.REPORT.STUDENTREPORT.replace(":studentId", studentId), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (response.status === 200 && response.data.success) {
                    setReport(response.data);
                } else {
                    setError(response.data.message || "Failed to fetch report");
                    setReport(null);
                }
            } catch (err) {
                setError("Failed to fetch student report");
                console.error(err);
                setReport(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (studentId) {
            fetchStudentReport();
        }
    }, [studentId, token]);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error || !report) {
        return (
            <div className="p-4 rounded-md bg-red-50 text-red-700">
                <p>{error || "Unable to load student report"}</p>
            </div>
        );
    }

    // Prepare chart data
    const chartData = [
        { name: 'Obtained', value: report.performance_summary.total_marks_obtained },
        { name: 'Remaining', value: report.performance_summary.total_possible_marks - report.performance_summary.total_marks_obtained }
    ];
    
    const COLORS = ['#4f46e5', '#e5e7eb'];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">Student Performance Report</h1>
            
            {/* Top Cards Row - Student Info and Performance Summary side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Info Card */}
                <Card className="overflow-hidden border-0 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                        <CardTitle className="flex items-center gap-2">
                            <UserRound className="h-5 w-5" />
                            <span>{report.student_info.name}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <AtSign className="h-4 w-4 text-gray-500" />
                                <span>{report.student_info.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span>{report.student_info.mobile || "Not provided"}</span>
                            </div>
                        
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Enrolled Classes:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {report.classes.length > 0 ? (
                                        report.classes.map((cls) => (
                                            <Badge 
                                                key={cls.class_id} 
                                                variant="outline" 
                                                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                            >
                                                {cls.class_name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-gray-500">No classes enrolled</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
 {/* Performance Summary Card with Chart */}
<Card className="border-0 shadow-md">
    <CardHeader>
        <CardTitle className="flex justify-between items-center">
            <span>Overall Performance</span>
            <span className="text-xl font-semibold">
                {report.performance_summary.average_score}%
            </span>
        </CardTitle>
    </CardHeader>
    <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Performance Pie Chart */}
            <div className="h-52 w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                        <RechartsTooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            {/* Performance Stats */}
            <div className="w-full md:w-1/2 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Exams Taken:</span>
                    <span className="font-medium">{report.performance_summary.total_exams_taken}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Total Score:</span>
                    <span className="font-medium">
                        {report.performance_summary.total_marks_obtained} / {report.performance_summary.total_possible_marks}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Average Score:</span>
                    <span className="font-medium text-blue-600">{report.performance_summary.average_score}%</span>
                </div>
                <Progress 
                    value={parseFloat(report.performance_summary.average_score)} 
                    className="h-2 mt-2"
                />
            </div>
        </div>
    </CardContent>
</Card>
            </div>

            <h2 className="text-xl font-semibold mt-8">Exam History</h2>
            
            {report.exams.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <h3 className="text-lg font-medium text-gray-700">No Exam Records</h3>
                    <p className="text-gray-500 max-w-md mx-auto mt-1">
                        This student hasn't taken any exams yet. Records will appear here once they complete their first assessment.
                    </p>
                </div>
            ) : (
                <Card className="border-0 shadow-md">
                    <ScrollArea className="h-[400px] w-full rounded-md">
                        <div className="p-4 space-y-4">
                            {report.exams.map((exam) => (
                                <Card key={exam.exam_id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <CardTitle>{exam.exam_title}</CardTitle>
                                        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                {exam.class_name}
                                            </Badge>
                                            <div className="flex items-center">
                                                <CalendarIcon className="w-4 h-4 mr-1" />
                                                {format(new Date(exam.date), "MMMM dd, yyyy")}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {exam.start_time} - {exam.end_time}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Score:</span>
                                                <span className="font-medium">
                                                    {exam.total_marks_obtained} / {exam.total_possible_marks}
                                                </span>
                                            </div>
                                            <Progress 
                                                value={exam.percentage}
                                                className="h-2"
                                            />
                                            <div className="text-right text-sm">
                                                {exam.percentage.toFixed(2)}%
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>
            )}
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64 mb-6" />
        
        {/* Top Cards Skeleton Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Info Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <div>
                            <Skeleton className="h-5 w-40 mb-2" />
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            {/* Performance Summary Skeleton */}
<Card>
    <CardHeader>
        <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-16" />
        </div>
    </CardHeader>
    <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
            <Skeleton className="h-52 w-full md:w-1/2 rounded-md" />
            <div className="w-full md:w-1/2 space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full mt-2" />
            </div>
        </div>
    </CardContent>
</Card>
        </div>

        <Skeleton className="h-6 w-32 mt-8" />
        
        {/* Exam History Skeleton with ScrollArea */}
        <Card>
            <CardContent className="p-0">
                <div className="h-[400px] p-4">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-full" />
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        <Skeleton className="h-5 w-24" />
                                        <Skeleton className="h-5 w-36" />
                                        <Skeleton className="h-5 w-32" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-2 w-full mt-2" />
                                    <Skeleton className="h-4 w-12 mt-2 ml-auto" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);

export default StudentReport;