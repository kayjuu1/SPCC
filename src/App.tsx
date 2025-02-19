import { Routes, Route, Navigate } from "react-router-dom";
import User from "./components/User.tsx";
import AdminPanel from "@/components/AdminPanel.tsx";
import SignIn from "./admin/SignIn";
import EditMember from "./admin/EditMemberPage";
import NavBar from "@/components/NavBar.tsx";
import React from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext.tsx";

// Layout component for protected routes (with NavBar)
function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            <NavBar adminName="Admin" />
            <main className="flex-1 overflow-y-auto pt-16"> {/* Add padding-top to prevent overlap */}
                {children}
            </main>
        </div>
    );
}

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/admin/signin" replace />;
    }

    return children;
}

function App() {
    return (
        <AuthProvider>
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
        </AuthProvider>
    );
}

export default App;