import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useAdmins} from "@/hooks/useAdmins";
import {formatDate} from "@/lib/utils";
import {AlertCircle, Shield, Trash2, UserPlus, Users} from "lucide-react";
import AdminCreationDialog from "@/components/AdminCreationDialog";
import {CreateAdminRequest} from "@/services/adminService";

export default function AdminsPage() {
    const {admins, loading, isSuperAdmin, addAdmin, updateAdmin, deleteAdmin} = useAdmins();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [creatingAdmin, setCreatingAdmin] = useState(false);

    // Get date format from settings
    const getDateFormat = () => {
        try {
            const savedSettings = localStorage.getItem('spcc-settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                return settings.display?.dateFormat || 'MM/DD/YYYY';
            }
        } catch (error) {
            console.error('Error reading date format:', error);
        }
        return 'MM/DD/YYYY';
    };

    const handleCreateAdmin = async (adminData: CreateAdminRequest) => {
        setCreatingAdmin(true);
        try {
            await addAdmin(adminData);
        } finally {
            setCreatingAdmin(false);
        }
    };

    const handleDeleteAdmin = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete admin ${name}?`)) {
            await deleteAdmin(id);
        }
    };

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        await updateAdmin(id, {status: newStatus});
    };

    if (!isSuperAdmin && !loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="max-w-md">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Access Denied
                        </h2>
                        <p className="text-gray-600">
                            Only super administrators can access this page.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Users className="w-8 h-8 text-teal-600 mr-3"/>
                        <h1 className="text-2xl font-bold text-gray-800">Admin Management</h1>
                    </div>
                    {isSuperAdmin && (
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-medium"
                        >
                            <UserPlus className="w-4 h-4 mr-2"/>
                            Add Admin
                        </Button>
                    )}
                </div>
                <p className="text-gray-600 mt-2">
                    Manage administrator accounts and permissions
                </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Users className="w-12 h-12 text-teal-600 mr-4"/>
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
                    <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-teal-600"/>
                        Administrator Accounts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading administrators...</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    {isSuperAdmin && <TableHead>Actions</TableHead>}
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
                                            {formatDate(admin.created_at, getDateFormat())}
                                        </TableCell>
                                        {isSuperAdmin && (
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusToggle(admin.id, admin.status)}
                                                        className="text-xs"
                                                    >
                                                        {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    </Button>
                                                    {admin.email !== 'admin@spcc.com' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                                        >
                                                            <Trash2 className="w-4 h-4"/>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Admin Creation Dialog */}
            <AdminCreationDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onCreateAdmin={handleCreateAdmin}
                loading={creatingAdmin}
            />
        </div>
    );
}