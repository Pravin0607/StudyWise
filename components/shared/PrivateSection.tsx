'use client';
import useUserStore from "@/store/userStore"
import { redirect } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react"

const PrivateSection = ({children}: PropsWithChildren) => {
    const user = useUserStore(state => state.user);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Just add a small delay to ensure hydration is complete
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);
    
    if (isLoading) {
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>;
    }
    
    if (user.token) {
        return <div>{children}</div>
    } else {
        redirect('/login');
        return null;
    }
}

export default PrivateSection