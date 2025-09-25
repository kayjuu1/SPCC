// Protected Route Wrapper
import {useAuth} from "@/hooks/useAuth";
import {Navigate, Route, Routes} from "react-router-dom";
import {User} from "lucide-react";
import Layout from "@/components/Layout";
import SignIn from "@/admin/SignIn";
import AllMembersPage from "@/pages/AllMembersPage";
import NewMembersPage from "@/pages/NewMembersPage";
import DeletedMembersPage from "@/pages/DeletedMembersPage";
import EditMember from "@/admin/EditMemberPage";
import DuesPage from "@/pages/DuesPage";
import AttendancePage from "@/pages/AttendancePage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminsPage from "@/pages/AdminsPage";
import {Toaster} from "@/components/ui/sonner";
import AdminDashboard from "@/components/AdminPanel";

function ProtectedRoute({children}: { children: React.ReactNode }) {
    const {isAuthenticated, loading} = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/signin" replace/>;
    }

    return <>{children}</>;
}

function App() {
    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<User/>}/>
                <Route path="/admin/signin" element={<SignIn/>}/>

                {/* Protected Admin Routes with Layout */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <Layout/>
                    </ProtectedRoute>
                }>
                    <Route path="dashboard" element={<AdminDashboard/>}/>
                    <Route path="members" element={<AllMembersPage/>}/>
                    <Route path="members/new" element={<NewMembersPage/>}/>
                    <Route path="members/deleted" element={<DeletedMembersPage/>}/>
                    <Route path="members/edit/:id" element={<EditMember/>}/>
                    <Route path="dues" element={<DuesPage/>}/>
                    <Route path="attendance" element={<AttendancePage/>}/>
                    <Route path="reports" element={<ReportsPage/>}/>
                    <Route path="profile" element={<ProfilePage/>}/>
                    <Route path="settings" element={<SettingsPage/>}/>
                    <Route path="admins" element={<AdminsPage/>}/>
                </Route>

                {/* Redirect to signin for unknown routes */}
                <Route path="*" element={<Navigate to="/admin/signin" replace/>}/>
            </Routes>
            <Toaster richColors/>
        </>
    );
}

export default App;