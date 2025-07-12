import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User, LogOut} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface NavBarProps {
    adminName: string;
    onLogout: () => void;
}

export default function NavBar({adminName, onLogout}: NavBarProps) {
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

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full top-0 left-0 shadow-md z-50">
            <div className="flex justify-between items-center">
                {/* Logo/Brand */}
                <div className="text-xl font-bold text-teal-700">Parish Manager</div>

                {/* Admin Profile Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="flex items-center space-x-3 hover:bg-gray-50 rounded-full p-1 cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">{adminName}</span>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src=""/>
                            <AvatarFallback className="bg-teal-100 text-teal-700">
                                {getInitials(adminName)}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4"/>
                            <span>Profile</span>
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
        </nav>
    );
}