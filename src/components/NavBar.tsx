import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {LogOut, Menu, Settings, User} from "lucide-react";
import {supabase} from "@/lib/supabase";
import {useNavigate} from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

interface NavBarProps {
    adminName: string;
    onLogout: () => void;
}

export default function NavBar({adminName, onLogout}: NavBarProps) {
    const navigate = useNavigate();

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onLogout(); // Call the onLogout prop
    };

    const { toggleSidebar } = useSidebar();

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full top-0 left-0 shadow-md z-50">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {/* Mobile menu button */}
                    <button 
                        onClick={toggleSidebar}
                        className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    
                    {/* Logo/Brand */}
                    <div className="text-xl font-bold text-teal-600 hidden md:block">SPCC Admin</div>
                </div>

                {/* Admin Profile Menu */}
                <div className="flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className={cn(
                                "flex items-center space-x-3 hover:bg-gray-50 rounded-full p-1 cursor-pointer",
                                "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                            )}
                        >
                            <span className="hidden sm:inline-block text-sm font-medium text-gray-700">
                                {adminName}
                            </span>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="" alt={adminName} />
                                <AvatarFallback className="bg-teal-100 text-teal-600">
                                    {getInitials(adminName)}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => navigate('/admin/profile')}
                                className="cursor-pointer"
                            >
                                <User className="mr-2 h-4 w-4"/>
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate('/admin/settings')}
                                className="cursor-pointer"
                            >
                                <Settings className="mr-2 h-4 w-4"/>
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                onClick={handleLogout} // Pass the function, don't call it
                                className="text-red-600 cursor-pointer"
                            >
                                <LogOut className="mr-2 h-4 w-4"/>
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}