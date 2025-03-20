import { Book, Calendar, UserPen, FileText, Home, LineChart, LogOut, Settings, Users } from "lucide-react"
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
        url: "/teacher/dashboard",
        icon: Home,
    },
    {
        title: "My Classes",
        url: "#",
        icon: UserPen,
    },
    {
        title: "Create Course",
        url: "#",
        icon: Book,
    },
    {
        title: "Assignments",
        url: "#",
        icon: FileText,
    },
    {
        title: "Students",
        url: "#",
        icon: Users,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Analytics",
        url: "#",
        icon: LineChart,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

const TeachersSidebar = () => {
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
                    <SidebarGroupLabel className="text-sm">Teacher Portal</SidebarGroupLabel>
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

export default TeachersSidebar