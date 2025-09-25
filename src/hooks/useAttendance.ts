import {useEffect, useState} from 'react';
import {supabase} from '@/lib/supabase';
import {toast} from "sonner";

export interface AttendanceRecord {
    id: string;
    date: string;
    adult_males: number;
    adult_females: number;
    male_children: number;
    female_children: number;
    total_attendance: number;
    notes: string | null;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export function useAttendance() {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            setError(null);

            const {data, error} = await supabase
                .from('attendance')
                .select('*')
                .order('date', {ascending: false});

            if (error) {
                throw error;
            }

            setAttendance(data || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch attendance';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const addAttendance = async (attendanceData: {
        date: string;
        adult_males: number;
        adult_females: number;
        male_children: number;
        female_children: number;
        notes?: string;
    }) => {
        try {
            const {data: {user}} = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const {data, error} = await supabase
                .from('attendance')
                .insert([{
                    ...attendanceData,
                    user_id: user.id
                }])
                .select()
                .single();

            if (error) {
                throw error;
            }

            setAttendance(prev => [data, ...prev]);
            toast.success('Attendance record added successfully');

            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add attendance';
            toast.error(errorMessage);
            throw err;
        }
    };

    const updateAttendance = async (id: string, updates: Partial<AttendanceRecord>) => {
        try {
            const {data, error} = await supabase
                .from('attendance')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            setAttendance(prev => prev.map(record =>
                record.id === id ? data : record
            ));

            toast.success('Attendance record updated successfully');

            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update attendance';
            toast.error(errorMessage);
            throw err;
        }
    };

    const deleteAttendance = async (id: string) => {
        try {
            const {error} = await supabase
                .from('attendance')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            setAttendance(prev => prev.filter(record => record.id !== id));
            toast.success('Attendance record deleted successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete attendance';
            toast.error(errorMessage);
            throw err;
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    return {
        attendance,
        loading,
        error,
        fetchAttendance,
        addAttendance,
        updateAttendance,
        deleteAttendance,
    };
}