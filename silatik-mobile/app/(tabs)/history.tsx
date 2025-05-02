// app/(tabs)/history.tsx atau app/(tabs)/profile.tsx
import React from 'react';
import { Text, View } from 'react-native';

export default function History() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is the new tab screen</Text>
    </View>
  );
}
