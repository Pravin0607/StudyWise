'use client';
import useUserStore from "@/store/userStore"
import { SidebarTrigger } from "../ui/sidebar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

const TopBar = () => {
    const {user, logout} = useUserStore();
    const handleLogout = () => {
        logout();
    }
  
  return (
    <div className='w-full bg-slate-300 h-12 rounded-[10px] flex items-center justify-between'>
        <SidebarTrigger className='hover:bg-slate-500 h-12 w-12 bg-gray-400'/>

        <div className='flex items-center'>
            <HoverCard>
                <HoverCardTrigger asChild>
                    <div 
                        className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium mr-3 cursor-pointer shadow-md hover:shadow-lg transition-all"
                    >
                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                </HoverCardTrigger>
                
                <HoverCardContent className="w-[300px]" align="end">
                    <div className="p-4 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-semibold shadow-md">
                                {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-base sm:text-lg">{user?.name || 'User'}</p>
                                <p className="text-sm sm:text-base font-medium text-gray-700">{user?.email || 'email@example.com'}</p>
                                <div className="mt-1">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {user?.role || 'Member'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-full bg-red-100 text-red-600 font-medium text-sm py-2 px-3 rounded-md hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                        >
                            <span>Log out</span>
                        </button>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>
    </div>
  )
}

export default TopBar