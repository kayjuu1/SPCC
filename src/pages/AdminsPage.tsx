import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmins } from "@/hooks/useAdmins";
import { UserPlus, Edit, Trash2, Users, Shield } from "lucide-react";
import SideBar from "@/components/SideBar";

export default function AdminsPage() {
    const { admins, loading, addAdmin, updateAdmin, deleteAdmin } = useAdmins();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        name: "",
        email: "",
        password: "",
        role: "admin"
    });

    const handleAddAdmin = async () => {
        try {
            await addAdmin(newAdmin);
            setIsAddDialogOpen(false);
            setNewAdmin({ name: "", email: "", password: "", role: "admin" });
        } catch (error) {
            console.error("Error adding admin:", error);
        }
    };

    const handleDeleteAdmin = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete admin ${name}?`)) {
            await deleteAdmin(id);
        }
    };

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        await updateAdmin(id, { status: newStatus });
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <SideBar />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Users className="w-8 h-8 text-blue-600 mr-3"/>
                                <h1 className="text-2xl font-bold text-gray-800">Admin Management</h1>
                            </div>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-teal-700 hover:bg-teal-800 text-white font-medium">
                                        <UserPlus className="w-4 h-4 mr-2"/>
                                        Add Admin
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New Admin</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={newAdmin.name}
                                                onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                                                placeholder="Enter full name"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={newAdmin.email}
                                                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={newAdmin.password}
                                                onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                                                placeholder="Enter password"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="role">Role</Label>
                                            <Select value={newAdmin.role} onValueChange={(value) => setNewAdmin({...newAdmin, role: value})}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="super_admin">Super Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddAdmin}>
                                            Add Admin
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Users className="w-12 h-12 text-blue-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Admins</p>
                                        <p className="text-3xl font-bold text-gray-800">{admins.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Shield className="w-12 h-12 text-green-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Admins</p>
                                        <p className="text-3xl font-bold text-gray-800">
                                            {admins.filter(admin => admin.status === 'active').length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <UserPlus className="w-12 h-12 text-purple-600 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Super Admins</p>
                                        <p className="text-3xl font-bold text-gray-800">
                                            {admins.filter(admin => admin.role === 'super_admin').length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Admins Table */}
                    <Card className="bg-white rounded-lg shadow-sm">
                        <CardHeader>
                            <CardTitle>Admin Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">Loading admins...</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {admins.map((admin) => (
                                            <TableRow key={admin.id}>
                                                <TableCell className="font-medium">{admin.name}</TableCell>
                                                <TableCell>{admin.email}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        admin.role === 'super_admin' 
                                                            ? 'bg-purple-100 text-purple-800' 
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        admin.status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {admin.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(admin.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleStatusToggle(admin.id, admin.status)}
                                                        >
                                                            {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}