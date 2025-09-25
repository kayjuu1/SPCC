import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import {BarChart3, Calendar, DollarSign, LayoutDashboard, Settings, Trash2, UserPlus, Users} from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";
import {cn} from "@/lib/utils";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin/dashboard",
            badge: null
        },
        {
            title: "All Members",
            icon: Users,
            path: "/admin/members",
            badge: null
        },
        {
            title: "New Members",
            icon: UserPlus,
            path: "/admin/members/new",
            badge: "New"
        },
        {
            title: "Dues Management",
            icon: DollarSign,
            path: "/admin/dues",
            badge: null
        },
        {
            title: "Attendance",
            icon: Calendar,
            path: "/admin/attendance",
            badge: null
        },
        {
            title: "Reports",
            icon: BarChart3,
            path: "/admin/reports",
            badge: null
        },
        {
            title: "Deleted Members",
            icon: Trash2,
            path: "/admin/members/deleted",
            badge: null
        },
        {
            title: "Admin Management",
            icon: Settings,
            path: "/admin/admins",
            badge: null
        }
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-teal-600">SPCC Admin</h1>
                <p className="text-sm text-gray-500 mt-1">Parish Management</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <Button
                        key={item.path}
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className={cn(
                            "w-full justify-start h-10 px-3",
                            isActive(item.path)
                                ? "bg-teal-600 text-white shadow-sm hover:bg-teal-700"
                                : "hover:bg-gray-100 hover:text-gray-900"
                        )}
                        onClick={() => navigate(item.path)}
                    >
                        <item.icon className="mr-3 h-4 w-4"/>
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                                {item.badge}
                            </Badge>
                        )}
                    </Button>
                ))}
            </nav>

            <Separator/>

            {/* Footer */}
            <div className="p-4">
                <div className="text-xs text-gray-500 text-center">
                    <p className="font-medium">St. Paul Catholic Church</p>
                    <p>Parish Management System</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;