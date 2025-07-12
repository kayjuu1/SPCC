import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {FileText, Menu, Users, X, UserPlus, Trash2, LayoutDashboard} from "lucide-react";
import {useParams, useNavigate, useLocation} from "react-router-dom";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const isActive = (path: string) => location.pathname === path;
    
    return (
        <>
            {/* Mobile Toggle Button */}
            <Button
                variant="outline"
                className="md:hidden fixed top-4 left-4 z-50 bg-teal-800 text-white p-2 rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
            </Button>

            {/* Sidebar */}
            <div className="w-64 bg-primary h-full p-4 space-y-2">
                <nav className="space-y-2">
                    <h1 className="text-white text-xl text-center mb-6 font-bold">ADMIN PANEL</h1>
                    
                    <Button 
                        variant="ghost"
                        className={`w-full justify-start text-white hover:text-white hover:bg-primary/90 ${
                            isActive("/admin/dashboard") ? "bg-primary/90" : ""
                        }`}
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4"/>
                        Dashboard
                    </Button>
                    
                    <Button variant="ghost"
                            className={`w-full justify-start text-white hover:text-white hover:bg-primary/90 ${
                                isActive("/admin/members") ? "bg-primary/90" : ""
                            }`}
                            onClick={() => navigate("/admin/members")}>
                        <FileText className="mr-2 h-4 w-4"/>
                        All Members
                    </Button>
                    
                    <Button variant="ghost"
                            className={`w-full justify-start text-white hover:text-white hover:bg-primary/90 ${
                                isActive("/admin/members/new") ? "bg-primary/90" : ""
                            }`}
                            onClick={() => navigate("/admin/members/new")}>
                        <UserPlus className="mr-2 h-4 w-4"/>
                        New Members
                    </Button>
                    
                    <Button variant="ghost"
                            className={`w-full justify-start text-white hover:text-white hover:bg-primary/90 ${
                                isActive("/admin/members/deleted") ? "bg-primary/90" : ""
                            }`}
                            onClick={() => navigate("/admin/members/deleted")}>
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Deleted Members
                    </Button>
                    
                    <Button variant="ghost"
                            className={`w-full justify-start text-white hover:text-white hover:bg-primary/90 ${
                                isActive("/admin/admins") ? "bg-primary/90" : ""
                            }`}
                            onClick={() => navigate("/admin/admins")}>
                        <Users className="mr-2 h-4 w-4"/>
                        Admin Management
                    </Button>
                </nav>
                
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-xs text-white/70 text-center">
                        SPCC Parish Manager
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
