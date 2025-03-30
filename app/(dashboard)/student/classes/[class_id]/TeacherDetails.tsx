"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, User, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "@/store/userStore";
import { Endpoints } from "@/lib/apiEndpoints";
import { useClassStudent } from "@/store/useClassStudent";
interface Teacher {
    email: string;
    first_name:string;
    last_name:string;
    mobile_no:string;
    user_id:string;
}


const TeacherDetails = () => {
    const class_id=useClassStudent(s=>s.selectedClass?.class_id);
    const [TeacherDetails, setTeacherDetails] = useState<Teacher | null>(null);
    const token=useUserStore((state)=>state.user.token);
    useEffect(()=>{
        (async()=>{
            // Simulate an API call to fetch teacher detail
            const resp=await axios.get(Endpoints.STUDENT.GETTEACHERDETAILS.replace(":classId",class_id!),{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setTeacherDetails(resp.data.teacher);
        })();
    },[])
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
                                {TeacherDetails?.first_name+" "+TeacherDetails?.last_name}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="text-blue-500 w-5 h-5" size={20} />
                            <span className="font-medium text-gray-600">
                                Email:
                            </span>
                            <span className="text-gray-900 text-lg">
                                {TeacherDetails?.email}
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
                                {TeacherDetails?.mobile_no}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TeacherDetails;
