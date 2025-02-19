import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {FileText, Menu, Users, X} from "lucide-react";
import {useParams, useNavigate} from "react-router-dom";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();
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
                    <h1 className="text-white text-xl text-center mb-4 font-bold">ADMIN DASHBOARD</h1>
                    <Button variant="ghost"
                            className="w-full justify-start text-white hover:text-white hover:bg-primary/90"
                            onClick={() => navigate("/admin/dashboard")}>
                        <FileText className="mr-2 h-4 w-4"/>
                        All Members
                    </Button>
                    <Button variant="ghost"
                            className="w-full justify-start text-white hover:text-white hover:bg-primary/90">
                        <FileText className="mr-2 h-4 w-4"/>
                        New Members
                    </Button>
                    <Button variant="ghost"
                            className="w-full justify-start text-white hover:text-white hover:bg-primary/90">
                        <FileText className="mr-2 h-4 w-4"/>
                        Deleted Members
                    </Button>
                    <Button variant="ghost"
                            className="w-full justify-start text-white hover:text-white hover:bg-primary/90">
                        <Users className="mr-2 h-4 w-4"/>
                        ADMINS
                    </Button>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
