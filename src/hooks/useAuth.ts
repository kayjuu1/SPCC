import {useEffect, useState} from 'react';
import {User} from '@supabase/supabase-js';
import {supabase} from '@/lib/supabase';
import {toast} from "sonner";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);
    const [warningTimeout, setWarningTimeout] = useState<NodeJS.Timeout | null>(null);

    // Get session timeout settings from localStorage or use defaults
    const getSessionSettings = () => {
        try {
            const savedSettings = localStorage.getItem('spcc-settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                return {
                    sessionTimeout: (settings.security?.sessionTimeout || 30) * 60 * 1000,
                    warningTime: (settings.security?.warningTime || 5) * 60 * 1000,
                };
            }
        } catch (error) {
            console.error('Error reading session settings:', error);
        }
        return {
            sessionTimeout: 30 * 60 * 1000, // 30 minutes default
            warningTime: 5 * 60 * 1000, // 5 minutes default
        };
    };

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            const {data: {session}} = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for auth changes
        const {data: {subscription}} = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);

                // Handle session timeout
                if (session?.user) {
                    startSessionTimeout();
                } else {
                    clearSessionTimeout();
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const startSessionTimeout = () => {
        clearSessionTimeout();
        clearWarningTimeout();

        const {sessionTimeout: SESSION_TIMEOUT, warningTime: WARNING_TIME} = getSessionSettings();

        // Set warning timeout (25 minutes)
        const warningTimer = setTimeout(() => {
            toast.warning(`Your session will expire in ${WARNING_TIME / 60000} minutes. Please save your work.`,
            );
        }, SESSION_TIMEOUT - WARNING_TIME);
        setWarningTimeout(warningTimer);

        // Set logout timeout (30 minutes)
        const timeout = setTimeout(() => {
            toast.error("Your session has expired. Please sign in again.");
            signOut();
        }, SESSION_TIMEOUT);
        setSessionTimeout(timeout);
    };

    const clearSessionTimeout = () => {
        if (sessionTimeout) {
            clearTimeout(sessionTimeout);
            setSessionTimeout(null);
        }
    };

    const clearWarningTimeout = () => {
        if (warningTimeout) {
            clearTimeout(warningTimeout);
            setWarningTimeout(null);
        }
    };

    const resetSessionTimeout = () => {
        if (user) {
            startSessionTimeout();
        }
    };

    const signIn = async (email: string, password: string) => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (data.user) {
            startSessionTimeout();
        }
        return {data, error};
    };

    const signOut = async () => {
        clearSessionTimeout();
        clearWarningTimeout();
        const {error} = await supabase.auth.signOut();
        return {error};
    };

    const signUp = async (email: string, password: string) => {
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        });
        return {data, error};
    };

    return {
        user,
        loading,
        signIn,
        signOut,
        signUp,
        isAuthenticated: !!user,
        resetSessionTimeout,
    };
}