import {useEffect, useState} from 'react';
import {Member, supabase} from '@/lib/supabase';
import {getMonthsBetween} from '@/lib/utils';
import {toast} from "sonner";

export function useMembers() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            setError(null);

            const {data, error} = await supabase
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
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const addMember = async (memberData: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            const {data, error} = await supabase
                .from('members')
                .insert([memberData])
                .select()
                .single();

            if (error) {
                throw error;
            }

            setMembers(prev => [...prev, data]);
            toast.success('Member added successfully');

            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add member';
            toast.error(errorMessage);
            throw err;
        }
    };

    const updateMember = async (id: string, updates: Partial<Member>) => {
        try {
            const {data, error} = await supabase
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

            toast.success('Member updated successfully');

            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update member';
            toast.error(errorMessage);
            throw err;
        }
    };

    const deleteMember = async (id: string) => {
        try {
            // First get the member data before deleting
            const {data: memberData, error: fetchError} = await supabase
                .from('members')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError) {
                throw fetchError;
            }

            // Get current user for tracking who deleted the member
            const {data: {user}} = await supabase.auth.getUser();

            // Store in deleted_members table
            const {error: insertError} = await supabase
                .from('deleted_members')
                .insert([{
                    original_member_id: id,
                    member_data: memberData,
                    deleted_by: user?.id,
                    reason: 'Deleted by admin'
                }]);

            if (insertError) {
                throw insertError;
            }

            // Now delete from members table
            const {error} = await supabase
                .from('members')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            setMembers(prev => prev.filter(member => member.id !== id));
            toast.error('Member deleted successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete member';
            toast.error(errorMessage);
            throw err;
        }
    };

    const recalculateDefaultedStatus = async () => {
        try {
            // Get dues start settings
            const savedSettings = localStorage.getItem('spcc-settings');
            let duesStartMonth = 'January';
            let duesStartYear = new Date().getFullYear();

            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                duesStartMonth = settings.dues?.startMonth || 'January';
                duesStartYear = settings.dues?.startYear || new Date().getFullYear();
            }

            // Get all expected months from start to current
            const expectedMonths = getMonthsBetween(duesStartMonth, duesStartYear);

            // Get all dues records
            const {data: allDues, error: duesError} = await supabase
                .from('dues')
                .select('member_id, month, year, paid');

            if (duesError) throw duesError;

            // Calculate defaulted status for each member
            const memberUpdates = members.map(member => {
                const memberDues = allDues?.filter(d => d.member_id === member.id) || [];

                // Check if member has paid for all expected months
                const hasUnpaidMonths = expectedMonths.some(month => {
                    const duesRecord = memberDues.find(d => d.month === month && d.year >= duesStartYear);
                    return !duesRecord || !duesRecord.paid;
                });

                return {
                    id: member.id,
                    defaulted: hasUnpaidMonths
                };
            });

            // Update all members
            for (const update of memberUpdates) {
                await supabase
                    .from('members')
                    .update({defaulted: update.defaulted})
                    .eq('id', update.id);
            }

            // Refresh members list
            await fetchMembers();

            toast.success('Defaulted status recalculated successfully');

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to recalculate defaulted status';
            toast.error(errorMessage);
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
        recalculateDefaultedStatus,
    };
}