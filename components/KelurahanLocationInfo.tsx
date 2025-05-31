import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface KelurahanLocationInfoProps {
  latitude: number;
  longitude: number;
}

export function KelurahanLocationInfo({ latitude, longitude }: KelurahanLocationInfoProps) {
  return (
    <View className="mb-6 rounded-xl bg-gray-50 p-4">
      <Text className="mb-2 text-lg font-semibold text-gray-900">Location</Text>
      <View className="flex-row items-center gap-2">
        <Ionicons name="location" size={16} color="#6b7280" />
        <Text className="text-gray-600">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </Text>
      </View>
    </View>
  );
}
