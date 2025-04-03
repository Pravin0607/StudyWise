"use client";
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { CalendarDays, GraduationCap, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Define interface for our dashboard data
interface DashboardData {
  total_classes: number;
  total_exams: number;
  total_students: number;
  exam_scores: {
    exam_id: string;
    exam_title: string;
    average_score: number;
  }[];
  student_scores: {
    student_id: string;
    student_name: string;
    average_score: number;
  }[];
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be an API call in a real application
    const mockData = {
      dashboard_data: {
        total_classes: 5,
        total_exams: 3,
        total_students: 2,
        exam_scores: [
          {
            exam_id: "c69e3633-cc8c-4071-b5c2-8ba179254428",
            exam_title: "Semister End - MCA",
            average_score: 0
          },
          {
            exam_id: "c6501b9a-e87c-4c5e-9b7f-2ca8549edccc",
            exam_title: "University Exam - 2025",
            average_score: 0
          },
          {
            exam_id: "812ca933-4a03-40b4-806a-cfcedb2232dc",
            exam_title: "Test Exam For Developement - Testing",
            average_score: 80
          }
        ],
        student_scores: [
          {
            student_id: "6350dfca-e950-4f7b-86a9-a1cab7052f73",
            student_name: "Jagdish Butte",
            average_score: 80
          },
          {
            student_id: "2c17a66e-7d18-435b-a655-1dfa74ae5c8d",
            student_name: "John Dev",
            average_score: 0
          }
        ]
      },
      success: true,
      message: "Teacher dashboard fetched successfully"
    };

    setData(mockData.dashboard_data);
    setLoading(false);
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard data...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <GraduationCap className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Students</p>
            <h2 className="text-3xl font-bold">{data?.total_students}</h2>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <FileText className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Exams</p>
            <h2 className="text-3xl font-bold">{data?.total_exams}</h2>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <CalendarDays className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Classes</p>
            <h2 className="text-3xl font-bold">{data?.total_classes}</h2>
          </div>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Exam Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.exam_scores}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="exam_title" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="average_score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Student Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.student_scores}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="average_score"
                  nameKey="student_name"
                >
                  {data?.student_scores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Average Score']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Tables Section - Now in a row with ScrollArea */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Student Performance Details</h3>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-right">Average Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.student_scores.map((student) => (
                  <TableRow key={student.student_id}>
                    <TableCell>{student.student_name}</TableCell>
                    <TableCell className="text-right">
                      <span 
                        className={`font-medium ${
                          student.average_score >= 70 
                            ? 'text-green-600' 
                            : student.average_score >= 40 
                              ? 'text-amber-600' 
                              : 'text-red-600'
                        }`}
                      >
                        {student.average_score}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Exam Results</h3>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Title</TableHead>
                  <TableHead className="text-right">Average Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.exam_scores.map((exam) => (
                  <TableRow key={exam.exam_id}>
                    <TableCell>{exam.exam_title}</TableCell>
                    <TableCell className="text-right">
                      <span 
                        className={`font-medium ${
                          exam.average_score >= 70 
                            ? 'text-green-600' 
                            : exam.average_score >= 40 
                              ? 'text-amber-600' 
                              : 'text-red-600'
                        }`}
                      >
                        {exam.average_score}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;