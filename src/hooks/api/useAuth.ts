/**
 * Auth Hooks
 * TanStack Query hooks for authentication
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/services/auth.service';
import type { LoginCredentials } from '@/lib/api/services/auth.interface';
import { queryKeys } from '@/lib/query/keys';

interface UseAuthOptions {
  loginRedirectPath?: string;
  logoutRedirectPath?: string;
}

export function useAuth(options?: UseAuthOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginRedirectPath = options?.loginRedirectPath ?? '/dashboard';
  const logoutRedirectPath = options?.logoutRedirectPath ?? '/';

  /**
   * Get current user
   */
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authService.getMe(),
    retry: false, // Don't retry auth failures
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  /**
   * Login mutation
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      router.push(loginRedirectPath); // Redirect after login
    },
  });

  /**
   * Logout mutation
   */
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      router.push(logoutRedirectPath);
    },
  });

  /**
   * Refresh token mutation
   */
  const refreshMutation = useMutation({
    mutationFn: () => authService.refresh(),
    onSuccess: () => {
      // Refetch user data after refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    refresh: refreshMutation.mutate,
    refreshAsync: refreshMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
