'use client';
import { BarChart2, BookOpen, DollarSign, Home, LifeBuoy, LogOut, Settings, Shield, Users } from "lucide-react"
import {  usePathname } from "next/navigation"
import useUserStore from "@/store/userStore"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: Home,
    },
    {
        title: "User Management",
        url: "#",
        icon: Users,
    },
    {
        title: "Courses",
        url: "#",
        icon: BookOpen,
    },
    {
        title: "Analytics",
        url: "#",
        icon: BarChart2,
    },
    {
        title: "System Settings",
        url: "#",
        icon: Settings,
    },
    {
        title: "Security",
        url: "#",
        icon: Shield,
    },
    {
        title: "Billing",
        url: "#",
        icon: DollarSign,
    },
    {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
    },
]

const AdminSidebar = () => {
    const pathname = usePathname()
    const { logout } = useUserStore()
    
    const handleLogout = () => {
        logout()
    }
    
    return (
        <Sidebar className="border-r border-border/40 bg-gradient-to-b from-background to-secondary/10 shadow-sm">
            <div className="px-4 py-6">
                <h2 className="text-xl font-bold tracking-tight text-primary mb-1">StudyWise</h2>
                <p className="text-sm text-muted-foreground">Admin Control Panel</p>
            </div>
            
            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-sm font-medium text-muted-foreground ml-3 mb-1">
                        MAIN NAVIGATION
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`transition-all duration-200 py-2.5 my-1 rounded-md font-medium text-[15px] ${
                                                pathname === item.url 
                                                ? "bg-primary/10 text-primary font-semibold" 
                                                : "hover:bg-secondary/80 hover:text-foreground"
                                            }`}
                                        >
                                            <Link href={item.url} className="flex items-center">
                                                <item.icon size={22} className={`mr-3 ${pathname === item.url ? "text-primary" : ""}`} />
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
                    className="flex items-center w-full p-3 text-[15px] font-medium rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-all duration-200"
                >
                    <LogOut size={20} className="mr-3" />
                    <span>Logout</span>
                </button>
                <p className="text-xs text-muted-foreground text-center mt-4">&copy; 2025 StudyWise</p>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AdminSidebar