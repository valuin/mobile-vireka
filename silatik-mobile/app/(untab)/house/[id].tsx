// app/(untab)/house/[id].tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity, // Keep if needed for View Maps or other actions
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Removed: Component imports (HouseholdHeader, HouseholdInfoArea)

// Import data types and API functions
import { FormattedHousehold, fetchHouseholds } from '@/service/api';

export default function HouseholdDetailsScreen() {
  const { id } = useLocalSearchParams();
  const householdId = typeof id === 'string' ? id : null;
  const router = useRouter(); // Keep router if needed for back or map navigation

  const [householdDetails, setHouseholdDetails] = useState<FormattedHousehold | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!householdId) {
        setError('Household ID not provided.');
        setLoading(false);
        return;
      }
      setLoading(true); // Ensure loading is true at the start
      setError(null); // Reset error on new fetch
      try {
        console.log(`Fetching details for household ID: ${householdId}`);
        const allHouseholds = await fetchHouseholds();
        const found = allHouseholds.find((h) => h.householdId === householdId);

        if (found) {
          setHouseholdDetails(found);
        } else {
          setError(`Household not found with ID: ${householdId}`);
        }
      } catch (err) {
        console.error('Error fetching household details:', err);
        setError('Failed to load household details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [householdId]);

  const handleViewMapsPress = () => {
    console.log('View Maps button pressed');
    if (householdDetails?.latitude && householdDetails?.longitude) {
      console.log(`Coordinates: Lat ${householdDetails.latitude}, Lng ${householdDetails.longitude}`);
      // TODO: Implement navigation to maps screen
    } else {
      console.warn('Household coordinates not available.');
    }
  };

  // --- Render Logic ---

  if (!householdId) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-gray-100">
        <View className="p-4">
          <Text className="text-center text-red-600">Error: Household ID is missing.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-gray-100">
        <ActivityIndicator size="large" color="#e53935" />
        <Text className="mt-2 text-gray-600">Loading details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-gray-100">
        <View className="p-4">
          <Text className="mt-2 text-center text-red-600">Error: {error}</Text>
          {/* Optional: Add a retry button */}
        </View>
      </SafeAreaView>
    );
  }

  if (!householdDetails) {
    // This case might be redundant if error handles 'not found', but good for safety
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-gray-100">
        <View className="p-4">
          <Text className="text-center text-gray-600">Household details not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- Main Content (Simplified) ---
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="p-4">
        <Text className="mb-4 text-2xl font-bold">Household Details</Text>

        {/* Display basic fetched data */}
        {householdDetails.housePhotoKey && (
          <Image
            source={{ uri: householdDetails.housePhotoKey }}
            className="w-full mb-4 bg-gray-300 rounded-lg h-52" // Added background color as placeholder
            resizeMode="cover"
          />
        )}

        <View className="mb-4 space-y-2">
          <Text className="text-lg font-semibold">{householdDetails.houseOwnerName}</Text>
          <Text className="text-base text-gray-700">Nomor: {householdDetails.nomor}</Text>
          <Text className="text-base text-gray-700">Address: {householdDetails.fullAddress}</Text>
          <Text className="text-base text-gray-700">Status: {householdDetails.status}</Text>
          <Text className="text-base text-gray-700">Jarak: {householdDetails.jarak}</Text>
          <Text className="text-base text-gray-700">Titik Larva: {householdDetails.titik}</Text>
          <Text className="text-base text-gray-700">ID: {householdDetails.householdId}</Text>
          {/* Add more fields as needed */}
        </View>

        {/* Example Button (kept from previous version) */}
        <TouchableOpacity className="items-center justify-center py-3 mt-4 bg-blue-500 rounded-md" onPress={handleViewMapsPress}>
          <Text className="font-bold text-white">View on Maps (Console Log)</Text>
        </TouchableOpacity>

        {/* Back Button Example */}
        <TouchableOpacity className="items-center justify-center py-3 mt-2 bg-gray-500 rounded-md" onPress={() => router.back()}>
          <Text className="font-bold text-white">Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
