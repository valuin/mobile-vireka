import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function Profile() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="mb-2 text-2xl font-bold text-gray-900">Profile</Text>
        <Text className="text-center text-gray-600">
          User profile and settings will be displayed here
        </Text>
      </View>
    </SafeAreaView>
  );
}
