import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface KelurahanActionButtonsProps {
  onViewOnMap?: () => void;
  onReportIssue?: () => void;
}

export function KelurahanActionButtons({
  onViewOnMap,
  onReportIssue,
}: KelurahanActionButtonsProps) {
  return (
    <View className="mt-auto flex-row gap-3">
      <TouchableOpacity className="flex-1 rounded-lg bg-teal-600 py-3" onPress={onViewOnMap}>
        <Text className="text-center font-semibold text-white">View on Map</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 rounded-lg border border-teal-600 py-3"
        onPress={onReportIssue}>
        <Text className="text-center font-semibold text-teal-600">Report Issue</Text>
      </TouchableOpacity>
    </View>
  );
}
