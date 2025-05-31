import React from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Text from '~/components/Text';

export const AppHeader = () => {
  const handleBackPress = () => {
    console.log('Back button pressed');
    router.back();
  };

  return (
    <View className="items-center bg-teal-600 pb-6 pt-12">
      <View className="w-full flex-row items-center justify-between px-6">
        <TouchableOpacity onPress={handleBackPress} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>

        <Text weight="bold" variant="heading" className="text-2xl text-white">
          Activity Hub
        </Text>

        <View className="w-8" />
      </View>
    </View>
  );
};
