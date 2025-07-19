import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Session timeout duration (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000;

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
    const timeout = setTimeout(() => {
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Your session has expired. Please sign in again.",
      });
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

  const resetSessionTimeout = () => {
    if (user) {
      startSessionTimeout();
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data.user) {
      startSessionTimeout();
    }
    return { data, error };
  };

  const signOut = async () => {
    clearSessionTimeout();
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
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