import { BarChart2, BookOpen, DollarSign, Home, LifeBuoy, LogOut, Settings, Shield, Users } from "lucide-react"
import { useRouter } from "next/navigation"
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
    const router = useRouter()
    const { logout } = useUserStore()
    
    const handleLogout = () => {
        logout()
        router.push('/login')
    }
    
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-sm">Admin Portal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="flex flex-col gap-3">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:text-red-500 transition-colors w-full p-2 rounded-md"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
                <p>&copy; 2023 StudyWise</p>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AdminSidebar