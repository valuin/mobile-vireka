import MapComponent from '@/components/MapCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter untuk navigasi
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Import fetchHouseholds dari service API
import { FormattedHousehold, fetchHouseholds } from '@/service/api';

// Mendapatkan tinggi layar untuk perhitungan
const { height: screenHeight } = Dimensions.get('window');
// Tinggi panel merah (sekitar 40% dari tinggi layar)
const PANEL_HEIGHT = screenHeight * 0.4;

export default function TabTwoScreen() {
  const [householdData, setHouseholdData] = useState<FormattedHousehold[]>([]);
  const [filteredData, setFilteredData] = useState<FormattedHousehold[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter(); // Inisialisasi router untuk navigasi

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        // Mengambil data dari API
        const data = await fetchHouseholds();
        setHouseholdData(data);
        setFilteredData(data);
      } catch (err) {
        setError('Failed to fetch household data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Handle search functionality
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      // Pencarian berdasarkan houseOwnerName
      const filtered = householdData.filter((item) => item.houseOwnerName?.toLowerCase().includes(text.toLowerCase()));
      setFilteredData(filtered);
    } else {
      setFilteredData(householdData);
    }
  };

  // Fungsi untuk kembali ke halaman home
  const handleBackPress = () => {
    router.back(); // Kembali ke halaman sebelumnya
    // Atau jika ingin langsung ke home:
    // router.push('/(tabs)');
  };

  // Render each household item
  const renderHouseholdItem = ({ item }: { item: FormattedHousehold }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 mb-3 bg-white rounded-xl"
      onPress={() => {
        // Handle item press - maybe center map on this location
      }}
    >
      <View className="flex-row items-center">
        <View className="items-center justify-center w-12 h-12 mr-3 rounded-full bg-red-50">
          <Ionicons name="home-outline" size={24} color="#E63946" />
        </View>
        <View>
          <Text className="text-base font-semibold">{item.houseOwnerName}</Text>
          <Text className="text-gray-500">
            Area Jentik: <Text className="text-red-500">{item.titik || 5} Titik</Text>
          </Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <Ionicons name="location-outline" size={16} color="#999" />
        <Text className="ml-1 text-gray-400">{item.jarak || '600 m'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#E63946" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="items-center justify-center flex-1">
        <Text className="text-red-500">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        {/* Back Button */}
        <TouchableOpacity className="absolute z-20 p-2 bg-white rounded-full shadow-md top-14 left-10" onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={30} color="#E63946" />
        </TouchableOpacity>

        {/* Map Component dengan data dari API */}
        <MapComponent data={householdData} />

        {/* Bottom Sheet with Search and List - dengan tinggi tetap */}
        <View className="absolute bottom-0 left-0 right-0 bg-red-500 rounded-t-3xl" style={{ height: PANEL_HEIGHT }}>
          {/* Handle Bar */}
          <View className="self-center w-16 h-1 my-3 rounded-full bg-white/50" />

          {/* Search Bar and Filter Button in one row */}
          <View className="flex-row items-center justify-between px-4 mb-3">
            <View className="flex-row items-center flex-1 px-4 py-2 mr-2 bg-white rounded-lg">
              <TextInput className="flex-1 h-10 text-gray-700" placeholder="Search by name" value={searchQuery} onChangeText={handleSearch} />
              <Ionicons name="search" size={20} color="#999" />
            </View>

            {/* Filter Button */}
            <TouchableOpacity
              className="p-3 bg-white rounded-lg shadow-md"
              onPress={() => {
                /* Toggle filter options */
              }}
            >
              <Ionicons name="menu" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Household List dari API - dengan tinggi yang sesuai */}
          <FlatList
            data={filteredData}
            renderItem={renderHouseholdItem}
            keyExtractor={(item, index) => `household-${index}`}
            className="px-4 pb-4"
            style={{
              // Tinggi FlatList = tinggi panel - tinggi handle bar - tinggi search bar - padding
              height: PANEL_HEIGHT - 80,
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center p-8 bg-white rounded-xl">
                <Text className="text-gray-500">No results found</Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
