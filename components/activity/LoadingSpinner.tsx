import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Text from '~/components/Text';

export const LoadingSpinner = () => {
  return (
    <View className="items-center justify-center py-12">
      <ActivityIndicator size="large" color="#0d9488" />
      <Text weight="medium" variant="body" className="mt-4 text-gray-600">
        Loading activities...
      </Text>
    </View>
  );
};
