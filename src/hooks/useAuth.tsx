import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Log successful login to activity_logs
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            supabase.rpc('log_auth_attempt', {
              p_email: session.user.email || '',
              p_action: 'Login',
              p_status: 'success',
              p_reason: 'Valid credentials provided',
              p_device: navigator.userAgent.split('(')[1]?.split(')')[0] || 'Unknown',
              p_ip_address: 'Client IP'
            });
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Log failed attempt
        await supabase.rpc('log_auth_attempt', {
          p_email: email,
          p_action: 'Login Attempt',
          p_status: 'denied',
          p_reason: error.message,
          p_device: navigator.userAgent.split('(')[1]?.split(')')[0] || 'Unknown',
          p_ip_address: 'Client IP'
        });

        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        // Log failed signup
        await supabase.rpc('log_auth_attempt', {
          p_email: email,
          p_action: 'Signup Attempt',
          p_status: 'denied',
          p_reason: error.message,
          p_device: navigator.userAgent.split('(')[1]?.split(')')[0] || 'Unknown',
          p_ip_address: 'Client IP'
        });

        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Log successful signup
      await supabase.rpc('log_auth_attempt', {
        p_email: email,
        p_action: 'Signup',
        p_status: 'success',
        p_reason: 'Account created successfully',
        p_device: navigator.userAgent.split('(')[1]?.split(')')[0] || 'Unknown',
        p_ip_address: 'Client IP'
      });

      toast({
        title: "Account created!",
        description: "You can now log in with your credentials.",
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
