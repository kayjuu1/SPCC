import { Routes, Route } from "react-router-dom";
import User from "./components/User.tsx";
import AdminPanel from "@/components/AdminPanel.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<User />} />
            <Route path="/admin" element={ <AdminPanel/>} />
            {/* Catch-all route for 404 pages */}
            <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
    );
}

export default App;
