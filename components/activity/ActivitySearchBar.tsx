import React, { useEffect, useState } from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useActivityStore } from '~/stores/activityStore';
import { useDebouncedCallback } from 'use-debounce';

export const ActivitySearchBar = () => {
  const [localSearch, setLocalSearch] = useState('');
  const { setSearchQuery } = useActivityStore();

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    console.log('Setting search query:', value);
    setSearchQuery(value);
  }, 300);

  useEffect(() => {
    debouncedSetSearch(localSearch);
  }, [localSearch, debouncedSetSearch]);

  return (
    <View className="mb-4 mt-6">
      <View className="flex-row items-center rounded-lg bg-white px-4 py-3 shadow-sm">
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          className="ml-3 flex-1 text-base text-gray-900"
          placeholder="Search Activities"
          placeholderTextColor="#9ca3af"
          value={localSearch}
          onChangeText={setLocalSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};
