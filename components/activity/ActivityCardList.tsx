import React from 'react';
import { FlatList, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useActivityStore } from '~/stores/activityStore';
import { useAuth } from '~/hooks/useAuth';
import { ActivityCard } from './ActivityCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import Text from '~/components/Text';

export interface Activity {
  id: string;
  name: string;
  status: 'High' | 'Moderate' | 'Low';
  timeSlot: string;
  imageUrl: string;
  description: string;
}

export const mockActivities: Activity[] = [
  {
    id: '1',
    name: 'Posyandu',
    status: 'High',
    timeSlot: '6AM - 10AM',
    imageUrl:
      'https://res.cloudinary.com/dk0z4ums3/image/upload/v1602495292/attached_image/ini-kegiatan-posyandu-dan-manfaatnya-bagi-ibu-dan-anak.jpg',
    description: 'Pelayanan kesehatan ibu dan anak',
  },
  {
    id: '2',
    name: 'Posbindu',
    status: 'Moderate',
    timeSlot: '8AM - 12PM',
    imageUrl:
      'https://puskesmas-cakranegara.dinkes.mataramkota.go.id/wp-content/uploads/2023/02/posbindu-ptm-2.jpeg',
    description: 'Pos pembinaan terpadu penyakit tidak menular',
  },
  {
    id: '3',
    name: 'Imunisasi',
    status: 'High',
    timeSlot: '9AM - 2PM',
    imageUrl:
      'https://res.cloudinary.com/dk0z4ums3/image/upload/v1638100413/attached_image/imunisasi.jpg',
    description: 'Program imunisasi rutin dan tambahan',
  },
];

const fetchActivities = async (searchQuery: string, puskesmasId?: string): Promise<Activity[]> => {
  console.log('Fetching activities with query:', searchQuery);

  // Mock data for now - replace with actual API call

  // Filter based on search query
  if (searchQuery) {
    return mockActivities.filter(
      (activity) =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return mockActivities;
};

export const ActivityCardList = () => {
  const { searchQuery } = useActivityStore();
  const { user } = useAuth();

  const {
    data: activities,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['activities', searchQuery, user?.puskesmas_id],
    queryFn: () => fetchActivities(searchQuery, user?.puskesmas_id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load activities" onRetry={() => refetch()} />;
  }

  if (!activities || activities.length === 0) {
    return (
      <View className="items-center py-8">
        <Text weight="medium" variant="body" className="text-gray-500">
          {searchQuery ? 'No activities found matching your search' : 'No activities available'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ActivityCard activity={item} />}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
};
