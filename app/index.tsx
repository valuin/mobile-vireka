import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useAuth, useCurrentUser } from '~/hooks/useAuth';

export default function Index() {
  const { isAuthenticated, accessToken } = useAuth();
  const { data: currentUser, isLoading, error } = useCurrentUser();

  console.log('Index page - Auth state:', { isAuthenticated, hasToken: !!accessToken });
  console.log('Index page - User query state:', {
    isLoading,
    hasUser: !!currentUser,
    error: error?.message,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || error) {
        console.log('Not authenticated or error occurred, redirecting to sign-in');
        router.replace('/(untab)/sign-in');
      } else if (currentUser) {
        console.log('User authenticated, redirecting to home');
        router.replace('/(tabs)/home');
      }
    }
  }, [isAuthenticated, currentUser, isLoading, error]);

  // Show loading state while checking authentication
  if (isLoading || isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  // Fallback redirect if useEffect doesn't trigger
  return <Redirect href="/(untab)/sign-in" />;
}
