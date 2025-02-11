import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import User from "./components/User.tsx";
import AdminPanel from "@/components/AdminPanel.tsx";
import SignIn from "./admin/SignIn";
import SignUp from "./admin/SignUp";

function App() {
    return (
        <Routes>
            <Route path="/" element={<User/>}/>
            <Route path="/admin" element={<SignIn/>}/>
            <Route path="/admin/signup" element={<SignUp/>}/>
            <Route path="/admin/dashboard" element={<AdminPanel/>}/>
        </Routes>
    );
}

export default App;
