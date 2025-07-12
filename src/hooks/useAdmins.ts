import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Admin } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export function useAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setAdmins(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admins';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async (adminData: { email: string; name: string; password: string; role?: string }) => {
    try {
      // First create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminData.email,
        password: adminData.password,
        email_confirm: true,
      });

      if (authError) {
        throw authError;
      }

      // Then create the admin record
      const { data, error } = await supabase
        .from('admins')
        .insert([{
          user_id: authData.user.id,
          email: adminData.email,
          name: adminData.name,
          role: adminData.role || 'admin',
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setAdmins(prev => [data, ...prev]);
      toast({
        description: 'Admin added successfully',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add admin';
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
      throw err;
    }
  };

  const updateAdmin = async (id: string, updates: Partial<Admin>) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setAdmins(prev => prev.map(admin => 
        admin.id === id ? data : admin
      ));

      toast({
        description: 'Admin updated successfully',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update admin';
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
      throw err;
    }
  };

  const deleteAdmin = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setAdmins(prev => prev.filter(admin => admin.id !== id));
      toast({
        description: 'Admin deleted successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete admin';
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
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
    fetchAdmins,
    addAdmin,
    updateAdmin,
    deleteAdmin,
  };
}