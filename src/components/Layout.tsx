import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider } from "@/context/SidebarContext";

function LayoutContent() {
    const { signOut, resetSessionTimeout } = useAuth();
    
    const handleLogout = async () => {
        await signOut();
    };
    
    // Reset session timeout on user activity
    React.useEffect(() => {
        const handleActivity = () => {
            resetSessionTimeout();
        };
        
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, handleActivity, true);
        });
        
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity, true);
            });
        };
    }, [resetSessionTimeout]);
    
    return (
        <div className="flex flex-col h-screen">
            <NavBar adminName="Admin" onLogout={handleLogout} />
            <div className="flex flex-1 pt-16 md:pt-10">
                <SideBar />
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 w-full">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function Layout() {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
}
