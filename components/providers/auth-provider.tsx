'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface Company {
  id: string;
  name: string;
  cuit: string;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  company: Company | null;
  role: string | null;
  isLoading: boolean;
  isMock: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [company, setCompany] = React.useState<Company | null>(null);
  const [role, setRole] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchUserData = React.useCallback(async (currentUser: User) => {
    try {
      // 1. Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      if (profile) setProfile(profile);

      // 2. Fetch Active Company & Role Membership
      const { data: membership } = await supabase
        .from('memberships')
        .select('role, companies(*)')
        .eq('user_id', currentUser.id)
        .limit(1)
        .maybeSingle();

      if (membership) {
        setRole(membership.role);
        if (membership.companies) {
          setCompany(membership.companies as unknown as Company);
        }
      }
    } catch (e) {
      console.error('Error fetching user meta:', e);
    }
  }, [supabase]);

  const refreshSession = React.useCallback(async () => {
    if (isMock) {
      // Load mock session from local storage or set default
      const mockSession = localStorage.getItem('fletix_mock_session');
      if (mockSession) {
        const parsed = JSON.parse(mockSession);
        setUser(parsed.user);
        setProfile(parsed.profile);
        setCompany(parsed.company);
        setRole(parsed.role);
      }
      setIsLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setCompany(null);
        setRole(null);
      }
    } catch (err) {
      console.error('Session refresh failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isMock, supabase.auth, fetchUserData]);

  React.useEffect(() => {
    refreshSession();

    if (isMock) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setCompany(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isMock, supabase.auth, fetchUserData, refreshSession]);

  const logout = async () => {
    setIsLoading(true);
    if (isMock) {
      localStorage.removeItem('fletix_mock_session');
      setUser(null);
      setProfile(null);
      setCompany(null);
      setRole(null);
      setIsLoading(false);
      router.push('/login');
      return;
    }
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        company,
        role,
        isLoading,
        isMock,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
