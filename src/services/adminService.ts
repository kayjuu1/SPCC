import { supabase } from '@/lib/supabase';

export interface CreateAdminRequest {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'super_admin';
}

export interface AdminUser {
  id: string;
  user_id: string | null;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

class AdminService {
  async createAdmin(adminData: CreateAdminRequest): Promise<AdminUser> {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Check if current user is super admin
      const { data: currentAdmin, error: checkError } = await supabase
        .from('admins')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (checkError || currentAdmin?.role !== 'super_admin') {
        throw new Error('Only super admins can create new admins');
      }

      // Call the secure edge function to create admin
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create admin');
      }

      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error('Admin creation error:', error);
      throw error;
    }
  }

  async getAdmins(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch admins: ${error.message}`);
    }

    return data || [];
  }

  async updateAdmin(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update admin: ${error.message}`);
    }

    return data;
  }

  async deleteAdmin(id: string): Promise<void> {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete admin: ${error.message}`);
    }
  }

  async getCurrentAdmin(): Promise<AdminUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  async isSuperAdmin(): Promise<boolean> {
    const admin = await this.getCurrentAdmin();
    return admin?.role === 'super_admin' && admin?.status === 'active';
  }
}

export const adminService = new AdminService();