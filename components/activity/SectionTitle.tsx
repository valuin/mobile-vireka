import React from 'react';
import { View } from 'react-native';
import Text from '~/components/Text';
import { useAuth } from '~/hooks/useAuth';

export const SectionTitle = () => {
  const { user } = useAuth();

  return (
    <View className="mb-4">
      <Text weight="semibold" variant="subheading" className="text-gray-900">
        Activities for Your Puskesmas
      </Text>
      {user?.puskesmas_id && (
        <Text weight="regular" variant="caption" className="mt-1 text-gray-600">
          Puskesmas ID: {user.puskesmas_id}
        </Text>
      )}
    </View>
  );
};
