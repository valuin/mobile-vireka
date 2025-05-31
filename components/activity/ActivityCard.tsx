import React from 'react';
import { View, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Text from '~/components/Text';
import { ActivityStatusTag } from './ActivityStatusTag';

interface Activity {
  id: string;
  name: string;
  status: 'High' | 'Moderate' | 'Low';
  timeSlot: string;
  imageUrl: string;
  description: string;
}

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const handleCardPress = () => {
    console.log('Activity card pressed:', activity.id);
    // @ts-ignore
    router.push(`/(untab)/activity-detail/${activity.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      className="mb-4 overflow-hidden rounded-lg bg-white shadow-md"
      activeOpacity={0.8}>
      <ImageBackground
        source={{ uri: activity.imageUrl }}
        className="h-48 w-full"
        resizeMode="cover">
        <View className="absolute bottom-0 left-0 right-0 h-24 bg-teal-600" />

        <View className="absolute bottom-4 left-4 right-4 flex-row items-center justify-between">
          <View className="flex-shrink">
            <Text weight="bold" variant="subheading" className="mb-2 text-white">
              {activity.name}
            </Text>
            <ActivityStatusTag status={activity.status} />
          </View>

          <View className="flex-row items-center">
            <Ionicons name="time" size={16} color="#ffffff" />
            <Text weight="medium" variant="caption" className="ml-1 text-white">
              {activity.timeSlot}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
