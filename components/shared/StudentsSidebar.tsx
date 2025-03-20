import { Calendar, Home, Inbox, LogOut, Search, Settings } from "lucide-react"
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
        url: "/student/dashboard",
        icon: Home,
    },
    {
        title: "Statistics",
        url: "#",
        icon: Inbox,
    },
    {
        title: "My Courses",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Enroll",
        url: "#",
        icon: Search,
    },
    {
        title: "Library",
        url: "#",
        icon: Settings,
    },
    {
        title: "Tutorials",
        url: "#",
        icon: Settings,
    },
    {
        title: "View Profile",
        url: "#",
        icon: Settings,
    },
    {
        title: "Edit Profile",
        url: "#",
        icon: Settings,
    },
]

const StudentsSidebar = () => {
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
                    <SidebarGroupLabel className="text-sm">Student Portal</SidebarGroupLabel>
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

export default StudentsSidebar