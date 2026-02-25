import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { APP_CONFIG } from "@/config/appConfig";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user para desenvolvimento sem API
const createMockUser = (): User | null => {
  if (!APP_CONFIG.USE_MOCK_DATA) return null;
  
  return {
    id: "mock-user-id",
    email: "usuario@exemplo.com",
    app_metadata: {},
    user_metadata: { full_name: "Usuário Demo" },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as User;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se estiver usando dados mockados, não inicializar autenticação real
    if (APP_CONFIG.USE_MOCK_DATA) {
      // Simular carregamento
      setTimeout(() => {
        // Opcional: definir um usuário mockado logado
        // setUser(createMockUser());
        setLoading(false);
      }, 500);
      return;
    }

    // Configuração real do Supabase

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (APP_CONFIG.USE_MOCK_DATA) {
      // Mock de login - sempre bem-sucedido com qualquer credencial
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockUser = createMockUser();
      setUser(mockUser);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (APP_CONFIG.USE_MOCK_DATA) {
      // Mock de cadastro - sempre bem-sucedido
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockUser = createMockUser();
      setUser(mockUser);
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName }
      }
    });
    
    return { error };
  };

  const signOut = async () => {
    if (APP_CONFIG.USE_MOCK_DATA) {
      setUser(null);
      setSession(null);
      return;
    }

    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
