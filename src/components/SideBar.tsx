import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Menu, X} from "lucide-react";


const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

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
            <aside className={`w-64 bg-teal-800 text-white p-4 fixed h-full md:relative transition-transform
                ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                <h2 className="text-xl font-bold mb-4">ADMIN DASHBOARD</h2>
                <nav>
                    <ul>
                        <li className="mb-2">
                            <Button variant="ghost" className="w-full text-left" onClick={() =>
                                window.location.href = "/admin/dashboard"}>
                                Home
                            </Button>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
