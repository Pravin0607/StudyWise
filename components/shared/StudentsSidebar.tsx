'use client';
import { Calendar, Home, Inbox, LogOut, Search, Settings, BookOpen, GraduationCap, Library, User, UserCog } from "lucide-react"
import { usePathname } from "next/navigation"
import useUserStore from "@/store/userStore"
import { useState, useCallback } from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import Link from "next/link";

// Menu items with better matching icons
const items = [
    {
        title: "Dashboard",
        url: "/student/dashboard",
        icon: Home,
    },
    // {
    //     title: "Statistics",
    //     url: "#",
    //     icon: Inbox,
    // },
    {
        title: "My Classes",
        url: "#",
        icon: BookOpen,
    },
    // {
    //     title: "Enroll",
    //     url: "#",

    //     icon: GraduationCap,
    // },
    // {
    //     title: "Library",
    //     url: "#",
    //     icon: Library,
    // },
    // {
    //     title: "Tutorials",
    //     url: "#",
    //     icon: Calendar,
    // },
    {
        title: "Settings",
        url: "/student/settings",
        icon: Settings,
    },
];

const StudentsSidebar = () => {
    const pathname = usePathname()
    const { logout } = useUserStore()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    
    const handleLogout = useCallback(() => {
        if (isLoggingOut) return; // Prevent double-clicks        
        setIsLoggingOut(true);        
        // First perform logout
        logout();        
    }, [logout, isLoggingOut]);

    return (
        <Sidebar className="border-r border-border/40 bg-gradient-to-b from-background to-secondary/10 shadow-sm">
            <div className="px-4 py-6">
                <h2 className="text-xl font-bold tracking-tight text-primary mb-1">StudyWise</h2>
                <p className="text-sm text-muted-foreground">Student Portal</p>
            </div>
            
            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-sm font-medium text-muted-foreground ml-3 mb-1">
                        LEARNING CENTER
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.url
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`transition-all duration-200 py-2.5 my-1 rounded-md font-medium text-[15px] ${
                                                isActive 
                                                ? "bg-primary/10 text-primary font-semibold" 
                                                : "hover:bg-secondary/80 hover:text-foreground"
                                            }`}
                                        >
                                            <Link href={item.url} className="flex items-center">
                                                <item.icon size={22} className={`mr-3 ${isActive ? "text-primary" : ""}`} />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter className="mt-auto border-t border-border/30 p-4">
                <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`flex items-center w-full p-3 text-[15px] font-medium rounded-md 
                        ${isLoggingOut 
                            ? "bg-gray-300 text-gray-500" 
                            : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600"} 
                        transition-all duration-200`}
                >
                    <LogOut size={20} className="mr-3" />
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>
                <p className="text-xs text-muted-foreground text-center mt-4">&copy; 2025 StudyWise</p>
            </SidebarFooter>
        </Sidebar>
    )
}

export default StudentsSidebar