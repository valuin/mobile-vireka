import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  email: string;
  role: string;
  puskesmas_id?: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'vireka-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000';

interface SignInRequest {
  email: string;
  password: string;
}

interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: number;
  puskesmas_id?: string;
}

interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

const signInApi = async (credentials: SignInRequest): Promise<AuthResponse> => {
  console.log('Signing in with:', credentials.email);

  const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Sign in failed');
  }

  const data = await response.json();
  console.log('Sign in successful:', data.user.email);
  return data;
};

const signUpApi = async (credentials: SignUpRequest): Promise<AuthResponse> => {
  console.log('Signing up with:', credentials.email);

  const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Sign up failed');
  }

  const data = await response.json();
  console.log('Sign up successful:', data.user.email);
  return data;
};

const getCurrentUser = async (token: string): Promise<User> => {
  console.log('Fetching current user');

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get current user');
  }

  const user = await response.json();
  console.log('Current user fetched:', user.email);
  return user;
};

export const useSignIn = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signInApi,
    onSuccess: (data) => {
      console.log('Setting auth data');
      setAuth(data.user, data.access_token, data.refresh_token);
      queryClient.setQueryData(['currentUser'], data.user);
    },
    onError: (error) => {
      console.log('Sign in error:', error.message);
    },
  });
};

export const useSignUp = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUpApi,
    onSuccess: (data) => {
      console.log('Setting auth data after sign up');
      setAuth(data.user, data.access_token, data.refresh_token);
      queryClient.setQueryData(['currentUser'], data.user);
    },
    onError: (error) => {
      console.log('Sign up error:', error.message);
    },
  });
};

export const useCurrentUser = () => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser(accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSignOut = () => {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('Signing out');
      // Clear local state immediately
      clearAuth();
      queryClient.clear();
    },
  });
};

export const useAuth = () => {
  const { user, accessToken } = useAuthStore();
  return {
    user,
    isAuthenticated: !!user && !!accessToken,
    accessToken,
  };
};
