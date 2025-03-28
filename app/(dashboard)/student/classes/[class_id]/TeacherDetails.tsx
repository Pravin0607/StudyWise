"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, User, User2 } from "lucide-react";

interface Teacher {
    name: string;
    email: string;
    contact: string;
}

const staticTeacher: Teacher = {
    name: "Professor Anya Sharma",
    email: "anya.sharma@techinstitute.edu",
    contact: "+91 9876543210",
};

const TeacherDetails = () => {
    return (
        <Card className="bg-white shadow-md border border-gray-200">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 tracking-tight">
                    Teacher Details
                </CardTitle>
                <Separator className="bg-gray-200" />
            </CardHeader>
            <CardContent className="text-gray-700 space-y-6">
                <div className="grid gap-8">
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <User2 className="text-blue-500 w-5 h-5" size={20} />
                            <span className="font-medium text-gray-600">
                                Name:
                            </span>
                            <span className="text-gray-900 text-lg">
                                {staticTeacher.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="text-blue-500 w-5 h-5" size={20} />
                            <span className="font-medium text-gray-600">
                                Email:
                            </span>
                            <span className="text-gray-900 text-lg">
                                {staticTeacher.email}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone
                                className="text-green-500 w-5 h-5"
                                size={20}
                            />
                            <span className="font-medium text-gray-600">
                                Contact:
                            </span>
                            <span className="text-gray-900 text-lg">
                                {staticTeacher.contact}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TeacherDetails;
