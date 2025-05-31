import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '~/components/activity/AppHeader';
import { ActivitySearchBar } from '~/components/activity/ActivitySearchBar';
import { SectionTitle } from '~/components/activity/SectionTitle';
import { ActivityCardList } from '~/components/activity/ActivityCardList';

export default function Activity() {
  console.log('Activity Hub - Rendering screen');

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View className="flex-1 bg-gradient-to-b from-teal-500 to-white">
        <AppHeader />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-4">
            <ActivitySearchBar />
            <SectionTitle />
          </View>

          <ActivityCardList />
        </ScrollView>
      </View>
    </View>
  );
}
