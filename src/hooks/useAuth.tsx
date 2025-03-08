
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// We will mock Supabase authentication until Supabase is properly integrated
// This is a placeholder that will be replaced with actual Supabase auth

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is saved in localStorage (simulating persistence)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Mock sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // For demo purposes, any email/password is valid
      const mockUser = { id: 'mock-user-id', email };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Connexion réussie!",
        description: "Bienvenue sur votre espace personnel.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Identifiants incorrects. Veuillez réessayer.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock sign up function
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = { id: 'mock-user-id', email, name };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Compte créé!",
        description: "Votre compte a été créé avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Impossible de créer votre compte. Veuillez réessayer.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('user');
      setUser(null);
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock reset password function
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Email envoyé",
        description: "Un email de réinitialisation a été envoyé à votre adresse.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
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
