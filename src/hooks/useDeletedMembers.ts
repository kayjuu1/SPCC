import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DeletedMember } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export function useDeletedMembers() {
  const [deletedMembers, setDeletedMembers] = useState<DeletedMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDeletedMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('deleted_members')
        .select('*')
        .order('deleted_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDeletedMembers(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch deleted members';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const restoreMember = async (deletedMember: DeletedMember) => {
    try {
      // Restore the member to the members table
      const { error: insertError } = await supabase
        .from('members')
        .insert([deletedMember.member_data]);

      if (insertError) {
        throw insertError;
      }

      // Remove from deleted_members table
      const { error: deleteError } = await supabase
        .from('deleted_members')
        .delete()
        .eq('id', deletedMember.id);

      if (deleteError) {
        throw deleteError;
      }

      setDeletedMembers(prev => prev.filter(dm => dm.id !== deletedMember.id));
      toast({
        description: 'Member restored successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore member';
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
      throw err;
    }
  };

  const permanentlyDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('deleted_members')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setDeletedMembers(prev => prev.filter(dm => dm.id !== id));
      toast({
        description: 'Member permanently deleted',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to permanently delete member';
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchDeletedMembers();
  }, []);

  return {
    deletedMembers,
    loading,
    error,
    fetchDeletedMembers,
    restoreMember,
    permanentlyDelete,
  };
}