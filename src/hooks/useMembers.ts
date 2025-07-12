import { useState, useEffect } from 'react';
import { supabase, Member } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setMembers(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch members';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert([memberData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMembers(prev => [...prev, data]);
      toast({
        description: 'Member added successfully',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add member';
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
      throw err;
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMembers(prev => prev.map(member => 
        member.id === id ? data : member
      ));

      toast({
        description: 'Member updated successfully',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update member';
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
      throw err;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setMembers(prev => prev.filter(member => member.id !== id));
      toast({
        description: 'Member deleted successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete member';
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
  };
}