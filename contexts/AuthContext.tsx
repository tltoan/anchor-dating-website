"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { User, AuthError } from "@supabase/supabase-js";
import {
  setAuthToken,
  setRefreshToken,
  setAuthUser,
  clearAuthData,
  getAuthUser,
  AuthUser,
} from "@/lib/auth-storage";

interface AuthContextType {
  user: User | null;
  authUser: AuthUser | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{ error: AuthError | null; needsConfirmation?: boolean }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  resendConfirmationEmail: (
    email: string,
  ) => Promise<{ error: AuthError | null }>;
  sendOTP: (email: string) => Promise<{ error: AuthError | null }>;
  verifyOTP: (
    email: string,
    token: string,
  ) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        // Store tokens
        if (session.access_token) {
          setAuthToken(session.access_token);
        }
        if (session.refresh_token) {
          setRefreshToken(session.refresh_token);
        }
        // Store user data
        const userData: AuthUser = {
          id: session.user.id,
          email: session.user.email || "",
          name:
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name,
        };
        setAuthUser(userData);
        setAuthUserState(userData);
      } else {
        // Try to restore from localStorage
        const savedUser = getAuthUser();
        if (savedUser) {
          setAuthUserState(savedUser);
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        if (session.access_token) {
          setAuthToken(session.access_token);
        }
        if (session.refresh_token) {
          setRefreshToken(session.refresh_token);
        }
        const userData: AuthUser = {
          id: session.user.id,
          email: session.user.email || "",
          name:
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name,
        };
        setAuthUser(userData);
        setAuthUserState(userData);
      } else {
        setUser(null);
        setAuthUserState(null);
        clearAuthData();
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/events`
              : undefined,
          data: {
            name: name || "",
            full_name: name || "",
          },
        },
      });

      if (error) {
        return { error };
      }

      // If session exists, user is immediately signed in (email confirmation disabled)
      if (data.session && data.user) {
        const user = data.user;
        setUser(user);
        if (data.session.access_token) {
          setAuthToken(data.session.access_token);
        }
        if (data.session.refresh_token) {
          setRefreshToken(data.session.refresh_token);
        }
        const userData: AuthUser = {
          id: user.id,
          email: user.email || "",
          name: name || user.user_metadata?.name,
        };
        setAuthUser(userData);
        setAuthUserState(userData);
        return { error: null, needsConfirmation: false };
      }

      // If no session, email confirmation is required
      // User will need to check their email and confirm before signing in
      return { error: null, needsConfirmation: true };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.session) {
        setUser(data.user);
        if (data.session.access_token) {
          setAuthToken(data.session.access_token);
        }
        if (data.session.refresh_token) {
          setRefreshToken(data.session.refresh_token);
        }
        const userData: AuthUser = {
          id: data.user.id,
          email: data.user.email || "",
          name:
            data.user.user_metadata?.name || data.user.user_metadata?.full_name,
        };
        setAuthUser(userData);
        setAuthUserState(userData);
      }

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAuthUserState(null);
      clearAuthData();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (!error && data.session) {
        setUser(data.session.user);
        if (data.session.access_token) {
          setAuthToken(data.session.access_token);
        }
        if (data.session.refresh_token) {
          setRefreshToken(data.session.refresh_token);
        }
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/events`
              : undefined,
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const sendOTP = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/events`
              : undefined,
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const verifyOTP = async (email: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        return { error };
      }

      if (data.session && data.user) {
        setUser(data.user);
        if (data.session.access_token) {
          setAuthToken(data.session.access_token);
        }
        if (data.session.refresh_token) {
          setRefreshToken(data.session.refresh_token);
        }
        const userData: AuthUser = {
          id: data.user.id,
          email: data.user.email || "",
          name:
            data.user.user_metadata?.name || data.user.user_metadata?.full_name,
        };
        setAuthUser(userData);
        setAuthUserState(userData);
      }

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authUser,
        loading,
        signUp,
        signIn,
        signOut,
        refreshSession,
        resendConfirmationEmail,
        sendOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
