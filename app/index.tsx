import { Redirect } from 'expo-router';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function Index() {
  return (
    <BottomSheetModalProvider>
      <Redirect href="/(tabs)/home" />
    </BottomSheetModalProvider>
  );
}
