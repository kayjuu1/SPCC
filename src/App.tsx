import { Routes, Route, Navigate } from "react-router-dom";
import User from "./components/User.tsx";
import AdminPanel from "@/components/AdminPanel.tsx";
import SignIn from "./admin/SignIn";
import EditMember from "./admin/EditMemberPage";
import NavBar from "@/components/NavBar.tsx";
import AllMembersPage from "@/pages/AllMembersPage";
import NewMembersPage from "@/pages/NewMembersPage";
import DeletedMembersPage from "@/pages/DeletedMembersPage";
import AdminsPage from "@/pages/AdminsPage";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";

// Layout component for protected routes (with NavBar)
function AdminLayout({ children }: { children: React.ReactNode }) {
    const { signOut } = useAuth();
    
    const handleLogout = async () => {
        await signOut();
    };
    
    return (
        <div className="flex flex-col h-screen">
            <NavBar adminName="Admin" onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto pt-16"> {/* Add padding-top to prevent overlap */}
                {children}
            </main>
        </div>
    );
}

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/signin" replace />;
    }

    return children;
}

function App() {
    return (
        <>
            <Routes>
                {/* User Route */}
                <Route path="/" element={<User />} />

                {/* Admin Authentication Routes */}
                <Route path="/admin/signin" element={<SignIn />} />

                {/* Protected Admin Routes (With Navbar) */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <AdminPanel />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/members"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <AllMembersPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/members/new"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <NewMembersPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/members/deleted"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <DeletedMembersPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/admins"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <AdminsPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/members/edit/:id"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <EditMember />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Redirect to /admin/signin for unknown routes */}
                <Route path="*" element={<Navigate to="/admin/signin" replace />} />
            </Routes>
            <Toaster />
        </>
    );
}

export default App;