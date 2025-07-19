import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface DuesRecord {
  id: string;
  member_id: string;
  amount: number;
  month: string;
  year: number;
  paid: boolean;
  payment_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  member_name?: string;
}

export function useDues() {
  const [dues, setDues] = useState<DuesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('dues_with_member_info')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) {
        throw error;
      }

      setDues(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dues';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const addDues = async (duesData: {
    member_id: string;
    amount: number;
    month: string;
    year: number;
    paid?: boolean;
    notes?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('dues')
        .insert([{
          ...duesData,
          user_id: user.id,
          paid: duesData.paid || false
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchDues(); // Refresh the list
      toast({
        description: 'Dues record added successfully',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add dues';
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
      throw err;
    }
  };

  const updateDues = async (id: string, updates: Partial<DuesRecord>) => {
    try {
      const { data, error } = await supabase
        .from('dues')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchDues(); // Refresh the list
      toast({
        description: 'Dues record updated successfully',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update dues';
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
      throw err;
    }
  };

  const deleteDues = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dues')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setDues(prev => prev.filter(dues => dues.id !== id));
      toast({
        description: 'Dues record deleted successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete dues';
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchDues();
  }, []);

  return {
    dues,
    loading,
    error,
    fetchDues,
    addDues,
    updateDues,
    deleteDues,
  };
}