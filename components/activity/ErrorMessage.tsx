import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '~/components/Text';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <View className="items-center justify-center px-6 py-12">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <Ionicons name="alert-circle" size={32} color="#ef4444" />
      </View>

      <Text weight="semibold" variant="subheading" className="mb-2 text-center text-gray-900">
        Something went wrong
      </Text>

      <Text weight="regular" variant="body" className="mb-6 text-center text-gray-600">
        {message}
      </Text>

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="flex-row items-center rounded-lg bg-teal-600 px-6 py-3">
          <Ionicons name="refresh" size={16} color="#ffffff" />
          <Text weight="semibold" variant="button" className="ml-2 text-white">
            Try Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
