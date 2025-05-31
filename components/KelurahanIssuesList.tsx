import React from 'react';
import { View, Text } from 'react-native';

interface KelurahanIssuesListProps {
  issues: string[];
}

export function KelurahanIssuesList({ issues }: KelurahanIssuesListProps) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-semibold text-gray-900">Current Issues</Text>
      <View className="flex-row flex-wrap gap-2">
        {issues.map((issue, index) => (
          <View key={index} className="rounded-lg border border-gray-200 bg-white px-3 py-2">
            <Text className="text-sm text-gray-700">{issue}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
