import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { User as AppUser } from '@/types';
// Import microservice client for fallback API access
import { microserviceClient } from '@/services/microserviceClient';

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
  hasRole: (roles: string | string[]) => boolean;
  isAdmin: boolean;
  isVendor: boolean;
  isCustomer: boolean;
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
      if (session?.user && event === 'SIGNED_IN') {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Use microservice client for consistent API access
      const profileData = await microserviceClient.userService(`user/${userId}`)
        .catch(() => null);

      if (profileData?.data) {
        const appUser: AppUser = {
          id: profileData.data.id,
          email: profileData.data.email || '',
          full_name: profileData.data.full_name,
          phone: profileData.data.phone,
          avatar_url: profileData.data.avatar_url,
          role: profileData.data.role,
          is_verified: profileData.data.is_verified || true,
          created_at: profileData.data.created_at,
          updated_at: profileData.data.updated_at
        };
        setUserProfile(appUser);
        return;
      }

      // Fallback to direct database access if microservice is unavailable
      const { data: directProfileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (directProfileData && !profileError) {
        const { data: { user } } = await supabase.auth.getUser();
        const appUser: AppUser = {
          id: directProfileData.id,
          email: user?.email || '',
          full_name: directProfileData.full_name,
          phone: directProfileData.phone,
          avatar_url: directProfileData.avatar_url,
          role: directProfileData.role,
          is_verified: true,
          created_at: directProfileData.created_at,
          updated_at: directProfileData.updated_at
        };
        setUserProfile(appUser);
        return;
      }

      // Create profile if none exists
      if (!profileError || profileError.code === 'PGRST116') {
        const { data: { user } } = await supabase.auth.getUser();
        const newProfile = {
          id: userId,
          full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
          role: 'customer' as const,
          phone: user?.user_metadata?.phone || null
        };

        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (insertedProfile && !insertError) {
          const appUser: AppUser = {
            id: insertedProfile.id,
            email: user?.email || '',
            full_name: insertedProfile.full_name,
            phone: insertedProfile.phone,
            avatar_url: insertedProfile.avatar_url,
            role: insertedProfile.role,
            is_verified: true,
            created_at: insertedProfile.created_at,
            updated_at: insertedProfile.updated_at
          };
          setUserProfile(appUser);
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

  // Role checking function
  const hasRole = (roles: string | string[]): boolean => {
    if (!userProfile) return false;
    
    if (typeof roles === 'string') {
      return userProfile.role === roles;
    }
    
    return roles.includes(userProfile.role);
  };

  // Convenience role checks
  const isAdmin = hasRole(['admin', 'super_admin']);
  const isVendor = hasRole('vendor');
  const isCustomer = hasRole(['customer', 'user']);

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
    hasRole,
    isAdmin,
    isVendor,
    isCustomer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
