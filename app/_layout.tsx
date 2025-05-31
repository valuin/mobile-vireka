import '../global.css';

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

export default function Layout() {
  const [loaded, error] = useFonts({
    'Manrope-ExtraLight': require('../assets/fonts/Manrope-200ExtraLight.ttf'),
    'Manrope-Light': require('../assets/fonts/Manrope-300Light.ttf'),
    'Manrope-Regular': require('../assets/fonts/Manrope-400Regular.ttf'),
    'Manrope-Medium': require('../assets/fonts/Manrope-500Medium.ttf'),
    'Manrope-SemiBold': require('../assets/fonts/Manrope-600SemiBold.ttf'),
    'Manrope-Bold': require('../assets/fonts/Manrope-700Bold.ttf'),
    'Manrope-ExtraBold': require('../assets/fonts/Manrope-800ExtraBold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="index" />
              <Stack.Screen name="(untab)/map" options={{ headerShown: false }} />
              <Stack.Screen name="(untab)/citizen-report/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="(untab)/kelurahan/[id]" options={{ headerShown: false }} />
            </Stack>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
