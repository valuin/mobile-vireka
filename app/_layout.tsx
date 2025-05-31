import '../global.css';

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" />
      <Stack.Screen name="map" options={{ headerShown: false }} />
    </Stack>
  );
}
