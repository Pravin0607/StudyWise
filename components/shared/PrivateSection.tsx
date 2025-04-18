'use client';
import useUserStore from "@/store/userStore";
import axios from "axios";
import { redirect } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { Endpoints } from "@/lib/apiEndpoints";

const PrivateSection = ({ children }: PropsWithChildren) => {
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser); // Assuming you have a setter for user in your store
    const logout=useUserStore(state=>state.logout);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            try {
                if (user.token) {
                    const response = await axios.get(Endpoints.VERIFYTOKEN, {
                        headers: { Authorization: `Bearer ${user.token}` },
                    });
                    if (response.status !== 200) {
                        throw new Error("Token validation failed");
                    }
                    // setUser(response.data); // Update user data if token is valid
                } else {
                    logout(); // Logout if no token
                    redirect('/login'); // Redirect if no token is present
                }
            } catch (error) {
                console.error("Token validation failed:", error);
                logout(); // Logout if token is invalid or expired
                redirect('/login'); // Redirect if token is invalid or expired
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();

        const interval = setInterval(() => {
            validateToken();
        }, 60000); // 60,000 ms = 1 minute

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [user.token, setUser]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <div>{children}</div>;
};

export default PrivateSection;