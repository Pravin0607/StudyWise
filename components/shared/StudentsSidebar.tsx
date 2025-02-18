import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

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
            <SidebarFooter>
                <p>&copy; 2023 StudyWise</p>
            </SidebarFooter>
        </Sidebar>
    )
}

export default StudentsSidebar