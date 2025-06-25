import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { User as AppUser } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithFacebook: () => Promise<any>;
  signInWithWhatsApp: () => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // First try to get from profiles table (which has role)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData && !profileError) {
        // Convert profiles data to AppUser format
        const appUser: AppUser = {
          id: profileData.id,
          email: profileData.id, // We'll get email from auth user
          full_name: profileData.full_name,
          phone: profileData.phone,
          avatar_url: profileData.avatar_url,
          role: profileData.role,
          is_verified: true, // Default for authenticated users
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        };

        // Get email from auth user
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          appUser.email = user.email;
        }

        setUserProfile(appUser);
        return;
      }

      // Fallback: try users table and create profile if needed
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userData && !userError) {
        // Create profile entry if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userData.id,
            full_name: userData.full_name,
            phone: userData.phone,
            role: 'user' // Default role
          });

        if (!insertError) {
          // Fetch the newly created profile
          await fetchUserProfile(userId);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { data, error };
  };

  const signInWithFacebook = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/`,
        scopes: 'email,public_profile',
      },
    });
    return { data, error };
  };

  const signInWithWhatsApp = async () => {
    // WhatsApp Business API integration would require custom implementation
    // For now, we'll simulate the flow and show instructions
    console.log('WhatsApp login initiated');
    
    // In a real implementation, you would:
    // 1. Integrate with WhatsApp Business API
    // 2. Send verification message via WhatsApp
    // 3. Verify user's response
    // 4. Create user session
    
    return { 
      data: null, 
      error: { 
        message: 'WhatsApp login requires WhatsApp Business API setup. Please contact support for integration.' 
      } 
    };
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (profileData: Partial<AppUser>) => {
    if (!user) throw new Error('No user logged in');
    
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id);

    if (error) throw error;
    await fetchUserProfile(user.id);
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signInWithWhatsApp,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
