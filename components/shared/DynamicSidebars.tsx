"use client";

import useUserStore from "@/store/userStore";
import { redirect } from "next/navigation";
import StudentsSidebar from "./StudentsSidebar";
import TeachersSidebar from "./TeachersSidebar";
import AdminSidebar from "./AdminSidebar";

const DynamicSidebars = () => {
    const user = useUserStore((state) => state.user);
    if (user.role === "admin") {
        return <AdminSidebar />;
    } else if (user.role === "student") {
        return <StudentsSidebar />;
    } else if (user.role === "teacher") {
        return <TeachersSidebar />;
    } else {
        redirect("/login");
    }
};

export default DynamicSidebars;
