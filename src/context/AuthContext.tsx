import {createContext, useContext, useEffect, useState} from "react";
import {supabase} from "@/supabaseClient.ts";

const AuthContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: (value: boolean) => {
    },
});

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const {data: {session}} = await supabase.auth.getSession();
            console.log("Session:", session); // Log the session for debugging
            setIsAuthenticated(!!session);
        };

        checkAuth();

        const {data: {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth State Changed:", event, session); // Log auth state changes
            setIsAuthenticated(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);