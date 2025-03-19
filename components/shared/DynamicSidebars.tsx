'use client';

import useUserStore from "@/store/userStore";
import { redirect } from "next/navigation";

const DynamicSidebars = () => {
    const user =useUserStore(state=>state.user)
    if(user.role==='admin'){
        return (
            <div>
                <h1>Admin Sidebar</h1>
            </div>
        )
    }else if(user.role==='student'){
        return (
            <div>
                <h1>Student Sidebar</h1>
            </div>
        )
    }else if(user.role==='teacher'){
        return (
            <div>
                <h1>Teacher Sidebar</h1>
            </div>
        )
    }else
    {
        redirect('/login');
        return null;
    }
}

export default DynamicSidebars