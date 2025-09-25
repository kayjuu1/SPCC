import {useEffect, useState} from 'react';
import {supabase} from '@/lib/supabase';
import {DeletedMember} from '@/types/database';
import {toast} from "sonner";

export function useDeletedMembers() {
    const [deletedMembers, setDeletedMembers] = useState<DeletedMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDeletedMembers = async () => {
        try {
            setLoading(true);
            setError(null);

            const {data, error} = await supabase
                .from('deleted_members')
                .select('*')
                .order('deleted_at', {ascending: false});

            if (error) {
                throw error;
            }

            setDeletedMembers(data || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch deleted members';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const restoreMember = async (deletedMember: DeletedMember) => {
        try {
            // Restore the member to the members table
            const {error: insertError} = await supabase
                .from('members')
                .insert([deletedMember.member_data]);

            if (insertError) {
                throw insertError;
            }

            // Remove from deleted_members table
            const {error: deleteError} = await supabase
                .from('deleted_members')
                .delete()
                .eq('id', deletedMember.id);

            if (deleteError) {
                throw deleteError;
            }

            setDeletedMembers(prev => prev.filter(dm => dm.id !== deletedMember.id));
            toast.success('Member restored successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to restore member';
            toast.error(errorMessage);
            throw err;
        }
    };

    const permanentlyDelete = async (id: string) => {
        try {
            const {error} = await supabase
                .from('deleted_members')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            setDeletedMembers(prev => prev.filter(dm => dm.id !== id));
            toast.success('Member permanently deleted');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to permanently delete member';
            toast.error(errorMessage);
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