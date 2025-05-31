import React from 'react';
import { View } from 'react-native';
import Text from '~/components/Text';

interface ActivityStatusTagProps {
  status: 'High' | 'Moderate' | 'Low';
}

export const ActivityStatusTag = ({ status }: ActivityStatusTagProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'High':
        return {
          borderColor: 'border-red-200',
          bgColor: 'bg-red-200',
          dotColor: 'bg-red-600',
          textColor: 'text-red-600',
          label: 'High Priority',
        };
      case 'Moderate':
        return {
          borderColor: 'border-yellow-200',
          bgColor: 'bg-yellow-200',
          dotColor: 'bg-yellow-600',
          textColor: 'text-yellow-600',
          label: 'Moderate Priority',
        };
      case 'Low':
        return {
          borderColor: 'border-green-200',
          bgColor: 'bg-green-200',
          dotColor: 'bg-green-600',
          textColor: 'text-green-600',
          label: 'Low Priority',
        };
      default:
        return {
          borderColor: 'border-gray-200',
          bgColor: 'bg-gray-200',
          dotColor: 'bg-gray-600',
          textColor: 'text-gray-600',
          label: 'Unknown',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View className={`rounded-full border ${config.borderColor} ${config.bgColor} px-2 py-1`}>
      <View className="flex-row items-center gap-1">
        <View className={`h-1 w-1 rounded-full ${config.dotColor}`} />
        <Text weight="semibold" className={`text-[9px] ${config.textColor}`}>
          {config.label}
        </Text>
      </View>
    </View>
  );
};
