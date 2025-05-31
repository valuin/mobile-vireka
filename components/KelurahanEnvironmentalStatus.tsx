import React from 'react';
import { View, Text } from 'react-native';

interface KelurahanEnvironmentalStatusProps {
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
}

export function KelurahanEnvironmentalStatus({ riskLevel }: KelurahanEnvironmentalStatusProps) {
  return (
    <View className="mb-6 rounded-xl bg-teal-50 p-4">
      <Text className="mb-2 text-lg font-semibold text-teal-800">Environmental Status</Text>
      <Text className="text-sm text-teal-700">
        This kelurahan has been classified as {riskLevel} risk based on current environmental and
        health indicators. Regular monitoring is being conducted to track changes in conditions.
      </Text>
    </View>
  );
}
