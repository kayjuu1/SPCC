import {useEffect, useState} from 'react';
import {adminService, AdminUser, CreateAdminRequest} from '@/services/adminService';
import {toast} from "sonner";

export function useAdmins() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await adminService.getAdmins();
            setAdmins(data);

            // Check if current user is super admin
            const superAdminStatus = await adminService.isSuperAdmin();
            setIsSuperAdmin(superAdminStatus);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admins';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const addAdmin = async (adminData: CreateAdminRequest) => {
        try {
            if (!isSuperAdmin) {
                throw new Error('Only super admins can create new admins');
            }

            const newAdmin = await adminService.createAdmin(adminData);
            setAdmins(prev => [newAdmin, ...prev]);

            toast.success('Admin added successfully');

            return newAdmin;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add admin';
            toast.error(errorMessage);
            throw err;
        }
    };

    const updateAdmin = async (id: string, updates: Partial<AdminUser>) => {
        try {
            const updatedAdmin = await adminService.updateAdmin(id, updates);
            setAdmins(prev => prev.map(admin =>
                admin.id === id ? updatedAdmin : admin
            ));

            toast.success('Admin updated successfully');

            return updatedAdmin;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update admin';
            toast.error(errorMessage);
            throw err;
        }
    };

    const deleteAdmin = async (id: string) => {
        try {
            await adminService.deleteAdmin(id);
            setAdmins(prev => prev.filter(admin => admin.id !== id));

            toast.success('Admin deleted successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete admin';
            toast.error(errorMessage);
            throw err;
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    return {
        admins,
        loading,
        error,
        isSuperAdmin,
        fetchAdmins,
        addAdmin,
        updateAdmin,
        deleteAdmin,
    };
}