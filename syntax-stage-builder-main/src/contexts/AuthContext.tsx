import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/ApiService";

const adminEmailConfig = ["harshadbagal77@gmail.com"];

const LOCAL_USERS_KEY = "codeacademy_local_users";
const CURRENT_USER_KEY = "codeacademy_user";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
  progress: {
    completedModules: string[];
    completedTopics: string[];
    totalPoints: number;
    currentStreak: number;
    achievements: string[];
  };
  preferences: {
    preferredLanguage: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    notifications: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProgress: (moduleId: string, topicId?: string) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  handleOAuthSuccess: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const determineRole = (email?: string, existingRole?: User["role"]): User["role"] => {
  if (email && adminEmailConfig.includes(email.toLowerCase())) {
    return "admin";
  }
  if (existingRole) {
    return existingRole;
  }
  return "user";
};

const buildUserFromApi = (payload: any, fallbackEmail?: string, fallbackName?: string): User => {
  const email = payload?.email || fallbackEmail || `user_${Date.now()}@example.com`;
  const name = payload?.name || fallbackName || email.split("@")[0];
  const avatar =
    payload?.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email || name)}`;

  return {
    id: payload?.id || payload?.user_id || `user_${Date.now()}`,
    name,
    email,
    avatar,
    role: determineRole(email, payload?.role),
    progress: {
      completedModules: payload?.progress?.completedModules || [],
      completedTopics: payload?.progress?.completedTopics || [],
      totalPoints: payload?.progress?.totalPoints || 0,
      currentStreak: payload?.progress?.currentStreak || 0,
      achievements: payload?.progress?.achievements || [],
    },
    preferences: {
      preferredLanguage: payload?.preferences?.preferredLanguage || "python",
      difficulty: payload?.preferences?.difficulty || "beginner",
      notifications: payload?.preferences?.notifications !== false,
    },
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const getStoredAccounts = () => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "{}") as Record<string, { password: string; user: User }>;
    } catch {
      return {};
    }
  };

  const persistStoredAccounts = (accounts: Record<string, { password: string; user: User }>) => {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(accounts));
  };

  const createLocalUser = (email: string, name?: string): User => ({
    id: `local_${Date.now()}`,
    name: name || email.split("@")[0],
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    role: determineRole(email),
    progress: {
      completedModules: [],
      completedTopics: [],
      totalPoints: 0,
      currentStreak: 0,
      achievements: []
    },
    preferences: {
      preferredLanguage: "python",
      difficulty: "beginner",
      notifications: true
    }
  });


  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await apiService.login(email, password);

      if (response.success && response.data?.user) {
        const apiUser = buildUserFromApi(response.data.user, email);
        setUser(apiUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(apiUser));
        toast({
          title: "Welcome back!",
          description: `Hello ${apiUser.name}, ready to continue learning?`,
        });
        return;
      }

      throw new Error(response.error || 'Login failed');
    } catch (error) {
      console.warn("Falling back to local login:", error);
      const accounts = getStoredAccounts();
      const record = accounts[email.toLowerCase()];
      if (record && record.password === password) {
        setUser(record.user);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(record.user));
        toast({
          title: "Welcome back!",
          description: `Hello ${record.user.name}, let's keep learning.`,
        });
        return;
      }
      toast({
        title: "Login failed",
        description: "Check your credentials or create a new account.",
        variant: "destructive",
      });
      throw new Error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);

    try {
      const response = await apiService.signup(email, password, name);

      if (response.success && response.data?.user) {
        const newUser = buildUserFromApi(response.data.user, email, name);
        setUser(newUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        toast({
          title: "Account created!",
          description: "Welcome to CodeAcademy Pro. Start your learning journey!",
        });
        return;
      }

      throw new Error(response.error || 'Signup failed');
    } catch (error) {
      console.warn("Falling back to local signup:", error);
      const accounts = getStoredAccounts();
      if (accounts[email.toLowerCase()]) {
        toast({
          title: "Account exists",
          description: "Please log in instead.",
          variant: "destructive",
        });
        throw new Error("Account already exists");
      }

      const newUser = createLocalUser(email, name);
      accounts[email.toLowerCase()] = { password, user: newUser };
      persistStoredAccounts(accounts);

      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      toast({
        title: "Account created!",
        description: "You're all set. Start your first course!",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const logout = useCallback(() => {
    console.log("🔒 Logging out and clearing all local session data");
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem('auth_token');
    localStorage.removeItem(LOCAL_USERS_KEY); // Clear local mock database for clean slate
    apiService.setToken(null);
    toast({
      title: "Logged out",
      description: "Come back soon to continue learning!",
    });
  }, [toast]);

  const syncUserFromApi = useCallback(async (token: string, options?: { showToast?: boolean }) => {
    try {
      setIsLoading(true);
      console.log(`📡 Syncing user profile for: ${token.substring(0, 10)}...`);
      apiService.setToken(token);
      const response = await apiService.getProfile();
      if (response.success && response.data) {
        const apiUser = buildUserFromApi(response.data);
        console.log(`👤 Profile synced successfully for identity: ${apiUser.email}`);
        setUser(apiUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(apiUser));
        if (options?.showToast) {
          toast({
            title: "Signed in successfully",
            description: `Welcome back, ${apiUser.name}!`,
          });
        }
        return;
      }
      throw new Error(response.error || response.message || 'Failed to load user profile');
    } catch (error) {
      if (options?.showToast) {
        toast({
          title: "Sign-in failed",
          description: error instanceof Error ? error.message : "Could not complete the sign-in process.",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleOAuthSuccess = useCallback(async (token: string) => {
    await syncUserFromApi(token, { showToast: true });
  }, [syncUserFromApi]);

  const updateProgress = useCallback((moduleId: string, topicId?: string) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const updatedUser = { ...prevUser };

      if (!updatedUser.progress.completedModules.includes(moduleId)) {
        updatedUser.progress.completedModules.push(moduleId);
      }

      if (topicId && !updatedUser.progress.completedTopics.includes(topicId)) {
        updatedUser.progress.completedTopics.push(topicId);
      }

      updatedUser.progress.totalPoints += topicId ? 50 : 100;

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      const accounts = getStoredAccounts();
      const existing = accounts[updatedUser.email.toLowerCase()];
      if (existing) {
        accounts[updatedUser.email.toLowerCase()] = {
          ...existing,
          user: updatedUser
        };
        persistStoredAccounts(accounts);
      }
      return updatedUser;
    });
  }, []);

  const updatePreferences = useCallback((preferences: Partial<User['preferences']>) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const updatedUser = {
        ...prevUser,
        preferences: { ...prevUser.preferences, ...preferences }
      };

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  // Non-blocking auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem(CURRENT_USER_KEY);
        const token = localStorage.getItem('auth_token');

        if (savedUser && token) {
          const userData = JSON.parse(savedUser);
          const normalizedUser: User = {
            ...userData,
            role: determineRole(userData.email, userData.role)
          };
          setUser(normalizedUser);
          // Sync with profile to ensure token is still valid
          syncUserFromApi(token).catch(err => {
            console.error("Session sync failed:", err);
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [syncUserFromApi]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      isLoading,
      login,
      signup,
      logout,
      updateProgress,
      updatePreferences,
      handleOAuthSuccess
    }),
    [user, isLoading, login, signup, logout, updateProgress, updatePreferences, handleOAuthSuccess]
  );

  // Handle token persistence on mount if user is not set
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!user && token && !isLoading) {
      syncUserFromApi(token).catch(() => {
        // Silent failure
      });
    }
  }, [syncUserFromApi, user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};