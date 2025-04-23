"use client";

import { createContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import supabaseClient from "../supabase/supabaseClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: { [key: string]: any }) => Promise<void>;
}

const SupabaseAuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signInWithGoogle: async () => {},
  signOut: async () => {},
  updateUserProfile: async () => {},
});

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error("Error signing up:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const signOutUser = async () => {
    try {
      await supabaseClient.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateUserProfile = async (userData: { [key: string]: any }) => {
    if (!user) throw new Error("No user is currently logged in");
    
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        data: userData
      });
      
      if (error) {
        throw error;
      }
      
      // Update the user state with the new data
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  return (
    <SupabaseAuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signUp,
        signIn,
        signInWithGoogle, 
        signOut: signOutUser,
        updateUserProfile
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export { SupabaseAuthContext }; 