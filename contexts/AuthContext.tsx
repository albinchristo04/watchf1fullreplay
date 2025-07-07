import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    loading: boolean;
    signInWithPassword: (email: string, pass: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LoadingState: React.FC = () => (
    <div className="w-screen h-screen flex items-center justify-center bg-f1-dark">
        <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-10 w-10 text-f1-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400 font-semibold">Loading Session...</p>
        </div>
    </div>
);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signInWithPassword = async (email: string, pass: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: pass,
        });
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = {
        session,
        loading,
        signInWithPassword,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <LoadingState /> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};