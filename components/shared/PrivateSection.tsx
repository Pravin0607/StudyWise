'use client';
import useUserStore from "@/store/userStore"
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react"

const PrivateSection = ({children}:PropsWithChildren) => {
    const user=useUserStore(state=>state.user)
    if(user.token){
        return (
            <div>{children}</div>
        )
    }else{
        redirect('/login');
        return null;
    }
}

export default PrivateSection